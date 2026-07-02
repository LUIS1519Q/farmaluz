from backend.models.medicamento import Medicamento
from backend.models.producto_farmacia import ProductoFarmacia
from backend.models.resultado_comparacion import (
    ResultadoComparacion,
    DetalleComparacion
)

from backend.services.parser_service import ParserService


class ComparadorService:

    SCORE_PRINCIPIO_ACTIVO = 70
    SCORE_CONCENTRACION = 20
    SCORE_PRESENTACION = 10
    SCORE_MARCA = 0

    SCORE_MINIMO = 75

    PRESENTACIONES_EQUIVALENTES = {

        "SOLIDO ORAL": [
            "TABLETA",
            "TABLETAS",
            "COMPRIMIDO",
            "COMPRIMIDOS",
            "CAPSULA",
            "CAPSULAS",
            "GRAGEA",
            "GRAGEAS"
        ],

        "LIQUIDO ORAL": [
            "JARABE",
            "SUSPENSION",
            "SOLUCION",
            "GOTAS"
        ],

        "SEMISOLIDO CUTANEO": [
            "CREMA",
            "GEL",
            "POMADA",
            "UNGUENTO"
        ],

        "LIQUIDO PARENTERAL": [
            "INYECTABLE",
            "AMPOLLA",
            "VIAL"
        ],

        "SOLIDO VAGINAL": [
            "OVULO"
        ],

        "SOLIDO RECTAL": [
            "SUPOSITORIO"
        ]
    }

    @classmethod
    def comparar(
        cls,
        medicamento: Medicamento,
        producto: ProductoFarmacia
    ) -> ResultadoComparacion:

        msp = ParserService.parsear_producto(

            f"{medicamento.principio_activo} "
            f"{medicamento.concentracion or ''} "
            f"{medicamento.primer_nivel_desagregacion or ''}"

        )

        farmacia = ParserService.parsear_producto(

            f"{producto.nombre_producto} "
            f"{producto.principio_activo or ''} "
            f"{' '.join(producto.principios_activos)} "
            f"{' '.join(producto.concentraciones)} "
            f"{producto.presentacion or ''}"

        )

        score = 0

        explicacion = []

        ####################################################
        # PRINCIPIO ACTIVO
        ####################################################

        principio_ok = bool(

            set(msp["principios_activos"])

            &

            set(farmacia["principios_activos"])

        )

        if not principio_ok:

            return ResultadoComparacion(

                producto=producto,

                score=0,

                coincide=False,

                principio_activo=DetalleComparacion(

                    coincide=False,

                    puntaje=0,

                    descripcion="Principio activo diferente"

                ),

                concentracion=DetalleComparacion(

                    coincide=False,

                    puntaje=0,

                    descripcion="No evaluada"

                ),

                presentacion=DetalleComparacion(

                    coincide=False,

                    puntaje=0,

                    descripcion="No evaluada"

                ),

                marca=DetalleComparacion(

                    coincide=False,

                    puntaje=0,

                    descripcion="No evaluada"

                ),

                explicacion=[

                    "Principio activo diferente."

                ]

            )

        score += cls.SCORE_PRINCIPIO_ACTIVO

        explicacion.append(

            f"Principio activo: {', '.join(farmacia['principios_activos'])}"

        )

        ####################################################
        # CONCENTRACION
        ####################################################

        concentracion_ok = bool(

            set(msp["concentraciones"])

            &

            set(farmacia["concentraciones"])

        )

        if concentracion_ok:

            score += cls.SCORE_CONCENTRACION

        explicacion.append(

            "Concentración: "

            + ", ".join(farmacia["concentraciones"])

        )

        ####################################################
        # PRESENTACION
        ####################################################

        presentacion_ok = False

        categoria = ParserService.normalizar(

            medicamento.primer_nivel_desagregacion or ""

        )

        if categoria in cls.PRESENTACIONES_EQUIVALENTES:

            presentacion_ok = (

                farmacia["presentacion"]

                in

                cls.PRESENTACIONES_EQUIVALENTES[categoria]

            )

        else:

            presentacion_ok = (

                farmacia["presentacion"]

                ==

                msp["presentacion"]

            )

        if presentacion_ok:

            score += cls.SCORE_PRESENTACION

        explicacion.append(

            f"Presentación: {farmacia['presentacion']}"

        )

        ####################################################
        # MARCA / LABORATORIO
        ####################################################

        marca_ok = bool(

            producto.marca

            or

            producto.laboratorio

        )

        if marca_ok:

            score += cls.SCORE_MARCA

        ####################################################
        # RESULTADO
        ####################################################

        return ResultadoComparacion(

            producto=producto,

            score=score,

            coincide=score >= cls.SCORE_MINIMO,

            principio_activo=DetalleComparacion(

                coincide=principio_ok,

                puntaje=cls.SCORE_PRINCIPIO_ACTIVO,

                descripcion="Principio activo"

            ),

            concentracion=DetalleComparacion(

                coincide=concentracion_ok,

                puntaje=cls.SCORE_CONCENTRACION,

                descripcion="Concentración"

            ),

            presentacion=DetalleComparacion(

                coincide=presentacion_ok,

                puntaje=cls.SCORE_PRESENTACION,

                descripcion="Presentación"

            ),

            marca=DetalleComparacion(

                coincide=marca_ok,

                puntaje=cls.SCORE_MARCA,

                descripcion="Marca/Laboratorio"

            ),

            explicacion=explicacion

        )

    @classmethod
    def seleccionar_mejor_producto(

        cls,

        medicamento: Medicamento,

        productos: list[ProductoFarmacia]

    ) -> ResultadoComparacion | None:

        mejor = None

        for producto in productos:

            resultado = cls.comparar(

                medicamento,

                producto

            )

            if mejor is None:

                mejor = resultado

                continue

            if resultado.score > mejor.score:

                mejor = resultado

            elif (

                resultado.score == mejor.score

                and

                resultado.producto.precio

                <

                mejor.producto.precio

            ):

                mejor = resultado
        return mejor

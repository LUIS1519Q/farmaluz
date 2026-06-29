import time

from playwright.sync_api import sync_playwright

from backend.models.precio import Precio
from backend.services.comparador_service import ComparadorService
from backend.services.cruzazul_service import CruzAzulService
from backend.services.medicamentos_service import MedicamentosService
from backend.services.parser_service import ParserService
from backend.services.precios_service import PreciosService


DEBUG = False
MAX_CONCURRENT_PAGES = 5


def debug_print(mensaje: str, debug: bool):

    if debug:

        print(mensaje)


def concentraciones_normalizadas(valores: list[str]) -> set[str]:

    concentraciones = set()

    for valor in valores:

        for concentracion in ParserService.obtener_concentraciones(valor):

            concentraciones.add(
                ParserService.normalizar_concentracion(concentracion)
            )

    return concentraciones


def presentacion_compatible(medicamento, producto) -> bool:

    categoria = ParserService.normalizar(
        medicamento.primer_nivel_desagregacion or ""
    )

    forma_msp = ParserService.parsear_producto(
        f"{categoria} {medicamento.forma_farmaceutica or ''}"
    )["presentacion"]

    forma_producto = ParserService.parsear_producto(
        f"{producto.presentacion or ''} {producto.nombre_producto}"
    )["presentacion"]

    if categoria in ComparadorService.PRESENTACIONES_EQUIVALENTES:

        return (
            forma_producto
            in
            ComparadorService.PRESENTACIONES_EQUIVALENTES[categoria]
        )

    equivalencias = [
        {"TABLETA", "TABLETAS", "COMPRIMIDO", "COMPRIMIDOS", "GRAGEA", "GRAGEAS"},
        {"CAPSULA", "CAPSULAS"},
        {"JARABE", "SOLUCION ORAL", "SOLUCION"},
        {"SUSPENSION", "SUSPENSION ORAL"},
        {"INYECTABLE", "AMPOLLA", "VIAL"},
        {"CREMA", "POMADA", "UNGUENTO", "GEL"},
        {"OVULO"},
        {"SUPOSITORIO"}
    ]

    if forma_msp and forma_producto and forma_msp == forma_producto:

        return True

    for grupo in equivalencias:

        if forma_msp in grupo and forma_producto in grupo:

            return True

    return False


def validacion_final(medicamento, producto, debug: bool = DEBUG) -> tuple[bool, str]:

    msp = ParserService.parsear_producto(
        f"{medicamento.principio_activo} "
        f"{medicamento.concentracion or ''} "
        f"{medicamento.primer_nivel_desagregacion or ''} "
        f"{medicamento.forma_farmaceutica or ''}"
    )

    farmacia = ParserService.parsear_producto(
        f"{producto.nombre_producto} "
        f"{producto.principio_activo or ''} "
        f"{' '.join(producto.principios_activos)} "
        f"{' '.join(producto.concentraciones)} "
        f"{producto.presentacion or ''}"
    )

    principio_ok = bool(
        set(msp["principios_activos"])
        &
        set(farmacia["principios_activos"])
    )

    if not principio_ok:

        debug_print("Descartado: principio activo diferente", debug)

        return False, "principio"

    concentraciones_msp = concentraciones_normalizadas(
        [medicamento.concentracion or ""]
    )

    concentraciones_farmacia = concentraciones_normalizadas(
        producto.concentraciones
        + [producto.nombre_producto]
    )

    concentracion_ok = bool(
        concentraciones_msp
        and
        concentraciones_farmacia
        and
        concentraciones_msp & concentraciones_farmacia
    )

    if not concentracion_ok:

        debug_print("Descartado: concentración distinta", debug)
        debug_print(f"MSP: {sorted(concentraciones_msp)}", debug)
        debug_print(f"Farmacia: {sorted(concentraciones_farmacia)}", debug)

        return False, "concentracion"

    if not presentacion_compatible(medicamento, producto):

        debug_print("Descartado: forma farmacéutica incompatible", debug)

        return False, "forma"

    return True, ""


def crear_precio(medicamento, mejor) -> Precio:

    diferencia = mejor.producto.precio - medicamento.precio_techo

    porcentaje = 0

    if medicamento.precio_techo > 0:

        porcentaje = (diferencia / medicamento.precio_techo) * 100

    return Precio(
        medicamento_id=medicamento.id,
        farmacia=mejor.producto.farmacia,
        producto=mejor.producto,
        score=mejor.score,
        precio_techo=medicamento.precio_techo,
        supera_precio_techo=mejor.producto.precio > medicamento.precio_techo,
        diferencia=diferencia,
        porcentaje_diferencia=porcentaje,
        semaforo=(
            "ROJO"
            if mejor.producto.precio > medicamento.precio_techo
            else "VERDE"
        ),
        ultima_actualizacion=mejor.producto.ultima_actualizacion
    )


def seleccionar_producto_valido(medicamento, productos, metricas: dict, debug: bool):

    mejor = None

    for producto in productos:

        metricas["productos_analizados"] += 1

        resultado = ComparadorService.comparar(medicamento, producto)

        debug_print(f"Producto encontrado: {producto.nombre_producto}", debug)
        debug_print(f"Score obtenido: {resultado.score}", debug)

        if not resultado.coincide:

            metricas["descartados_score"] += 1
            debug_print("Descartado: score insuficiente", debug)

            continue

        valido, motivo = validacion_final(medicamento, producto, debug)

        if not valido:

            if motivo == "concentracion":
                metricas["descartados_concentracion"] += 1
            elif motivo == "principio":
                metricas["descartados_principio"] += 1
            elif motivo == "forma":
                metricas["descartados_forma"] += 1

            continue

        if mejor is None:

            mejor = resultado

            continue

        if resultado.score > mejor.score:

            mejor = resultado

        elif (
            resultado.score == mejor.score
            and
            resultado.producto.precio < mejor.producto.precio
        ):

            mejor = resultado

    return mejor


def procesar_medicamento(medicamento, productos, indice: int, total: int, metricas: dict, debug: bool):

    inicio = time.time()

    mejor = seleccionar_producto_valido(
        medicamento,
        productos,
        metricas,
        debug
    )

    if mejor is None:

        metricas["medicamentos_sin_resultados"] += 1

        print(f"[{indice}/{total}] {medicamento.principio_activo}")
        print("No hubo coincidencias.")

        return

    precio = crear_precio(medicamento, mejor)

    actualizado = PreciosService.guardar(precio)

    if actualizado:

        metricas["coincidencias_validas"] += 1
        metricas["medicamentos_actualizados"] += 1

    print(f"[{indice}/{total}] {medicamento.principio_activo}")
    print(f"✔ {mejor.producto.nombre_producto}")
    print("Actualizado" if actualizado else "Sin cambios")
    print(f"Precio: {mejor.producto.precio:.2f}")
    print(f"Tiempo: {round(time.time() - inicio, 2)} s")


def ejecutar(
    browser=None,
    context=None,
    medicamentos=None,
    max_concurrent_pages: int = MAX_CONCURRENT_PAGES,
    debug: bool = DEBUG
) -> dict:

    if medicamentos is None:

        medicamentos = MedicamentosService.obtener_todos()

    total = len(medicamentos)

    print()
    print("Farmacia: Cruz Azul")
    print(f"Medicamentos: {total}")

    if browser is None and context is None:

        with sync_playwright() as p:

            browser_local = p.chromium.launch(headless=True)
            context_local = browser_local.new_context()

            try:

                return ejecutar(
                    browser=browser_local,
                    context=context_local,
                    medicamentos=medicamentos,
                    max_concurrent_pages=max_concurrent_pages,
                    debug=debug
                )

            finally:

                context_local.close()
                browser_local.close()

    if context is None:

        context = browser.new_context()
        cerrar_context = True

    else:

        cerrar_context = False

    page = context.new_page()

    metricas = {
        "medicamentos_msp": total,
        "principios_activos_procesados": 0,
        "productos_encontrados": 0,
        "productos_analizados": 0,
        "coincidencias_validas": 0,
        "descartados_concentracion": 0,
        "descartados_principio": 0,
        "descartados_forma": 0,
        "descartados_score": 0,
        "medicamentos_sin_resultados": 0,
        "errores_scraping": 0,
        "medicamentos_actualizados": 0
    }

    medicamentos_por_principio = {}

    for indice, medicamento in enumerate(medicamentos, start=1):

        clave = ParserService.normalizar(medicamento.principio_activo)

        medicamentos_por_principio.setdefault(clave, []).append(
            (indice, medicamento)
        )

    cache_busquedas = {}

    try:

        for principio, grupo in medicamentos_por_principio.items():

            metricas["principios_activos_procesados"] += 1

            try:

                if principio not in cache_busquedas:

                    cache_busquedas[principio] = CruzAzulService.obtener_productos(
                        page,
                        grupo[0][1].principio_activo
                    )

                productos = cache_busquedas[principio]

                metricas["productos_encontrados"] += len(productos)

                if not productos:

                    for indice, medicamento in grupo:

                        metricas["medicamentos_sin_resultados"] += 1
                        print(f"[{indice}/{total}] {medicamento.principio_activo}")
                        print("No se encontraron productos.")

                    continue

                for indice, medicamento in grupo:

                    debug_print(f"Medicamento MSP: {medicamento}", debug)
                    procesar_medicamento(
                        medicamento,
                        productos,
                        indice,
                        total,
                        metricas,
                        debug
                    )

            except Exception as e:

                metricas["errores_scraping"] += len(grupo)

                for indice, medicamento in grupo:

                    print(f"[{indice}/{total}] {medicamento.principio_activo}")
                    print(f"Error procesando {medicamento.principio_activo}: {e}")

    finally:

        page.close()

        if cerrar_context:

            context.close()

    return metricas


if __name__ == "__main__":

    ejecutar()

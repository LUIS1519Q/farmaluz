import re
import unicodedata

from backend.services.equivalencias import EQUIVALENCIAS


class ParserService:

    ABREVIATURAS_PRESENTACION = {

        "TABS": "TABLETA",
        "TAB": "TABLETA",
        "COMP": "COMPRIMIDO",
        "CAPS": "CAPSULA",
        "CAP": "CAPSULA",
        "AMP": "AMPOLLA",
        "SUSP": "SUSPENSION",
        "SOL": "SOLUCION",
        "UNG": "UNGUENTO",
        "INY": "INYECTABLE",
        "JBE": "JARABE",
        "GTS": "GOTAS",
        "OV": "OVULO",
        "SUP": "SUPOSITORIO"

    }

    PRESENTACIONES = [

        "SOLIDO ORAL",
        "LIQUIDO ORAL",
        "SEMISOLIDO CUTANEO",
        "LIQUIDO PARENTERAL",
        "SOLIDO VAGINAL",
        "SOLIDO RECTAL",
        "TABLETA",
        "TABLETAS",
        "COMPRIMIDO",
        "COMPRIMIDOS",
        "CAPSULA",
        "CAPSULAS",
        "GRAGEA",
        "GRAGEAS",
        "JARABE",
        "SUSPENSION",
        "SOLUCION",
        "SOLUCION ORAL",
        "SOLUCION INYECTABLE",
        "INYECTABLE",
        "AMPOLLA",
        "VIAL",
        "GOTAS",
        "CREMA",
        "GEL",
        "POMADA",
        "UNGUENTO",
        "SPRAY",
        "AEROSOL",
        "OVULO",
        "SUPOSITORIO",
        "PARCHE"

    ]

    CLAVES_FECHA_ELABORACION = [

        "Fecha de Elaboracion",
        "Fecha Elaboracion",
        "Elaboracion",
        "Fecha de Fabricacion",
        "Fecha Fabricacion",
        "Fabricacion",

    ]

    CLAVES_FECHA_VENCIMIENTO = [

        "Fecha de Vencimiento",
        "Fecha Vencimiento",
        "Vencimiento",
        "Fecha de Caducidad",
        "Fecha Caducidad",
        "Caducidad",

    ]

    CLAVES_DOSIFICACION = [

        "Dosificacion",
        "Dosis",
        "Posologia",

    ]

    CLAVES_TIPO_PRESENTACION = [

        "Tipo de Presentacion",
        "Presentacion",
        "Forma Farmaceutica",

    ]

    @staticmethod
    def buscar_campo(
        ficha: dict,
        candidatos: list[str]
    ) -> str | None:

        if not ficha:
            return None

        normalizados = {

            ParserService.normalizar(clave): valor

            for clave, valor in ficha.items()

        }

        for candidato in candidatos:

            valor = normalizados.get(
                ParserService.normalizar(candidato)
            )

            if valor:
                return valor

        return None

    @staticmethod
    def normalizar(texto: str) -> str:

        if not texto:
            return ""

        texto = texto.upper()

        texto = unicodedata.normalize(
            "NFKD",
            texto
        ).encode(
            "ASCII",
            "ignore"
        ).decode(
            "utf-8"
        )

        texto = texto.replace(
            "+",
            " + "
        )

        texto = re.sub(
            r"(\d),(\d)",
            r"\1.\2",
            texto
        )

        texto = re.sub(
            r"(\d+(?:\.\d+)?)\s*(MG|MCG|G|ML|UI|%)\b",
            r"\1 \2",
            texto
        )

        texto = re.sub(
            r"(\d+(?:\.\d+)?)\s*%",
            r"\1 %",
            texto
        )

        texto = re.sub(
            r"[(),;:]",
            " ",
            texto
        )

        texto = re.sub(
            r"\s+",
            " ",
            texto
        )

        return texto.strip()

    @classmethod
    def normalizar_abreviaturas_presentacion(
        cls,
        texto: str
    ) -> str:

        texto = cls.normalizar(
            texto
        )

        for abreviatura, presentacion in cls.ABREVIATURAS_PRESENTACION.items():

            texto = re.sub(
                rf"\b{abreviatura}\.?\b",
                presentacion,
                texto
            )

        return texto

    @classmethod
    def normalizar_concentracion(
        cls,
        texto: str
    ) -> str:

        texto = cls.normalizar(
            texto
        )

        texto = re.sub(
            r"\s*/\s*",
            "/",
            texto
        )

        texto = re.sub(
            r"\s+",
            " ",
            texto
        )

        return texto.strip()

    @classmethod
    def obtener_principios_activos(
        cls,
        texto: str
    ) -> list[str]:

        texto = cls.normalizar(
            texto
        )

        encontrados = []

        for equivalente, oficial in EQUIVALENCIAS.items():

            if equivalente in texto:

                if oficial not in encontrados:

                    encontrados.append(
                        oficial
                    )

        return encontrados

    @classmethod
    def obtener_concentraciones(
        cls,
        texto: str
    ) -> list[str]:

        texto = cls.normalizar(
            texto
        )

        patron = (

            r"\d+(?:[.,]\d+)?"

            r"(?:/\d+(?:[.,]\d+)?)?"

            r"\s*"

            r"(?:MG|MCG|G|ML|UI|%)"

            r"(?:\s*/\s*(?:\d+(?:[.,]\d+)?\s*)?(?:MG|MCG|G|ML|UI|%))?"

        )

        concentraciones = re.findall(
            patron,
            texto
        )

        return [
            cls.normalizar_concentracion(concentracion)
            for concentracion in concentraciones
        ]

    @classmethod
    def obtener_presentacion(
        cls,
        texto: str
    ) -> str:

        texto = cls.normalizar_abreviaturas_presentacion(
            texto
        )

        for presentacion in cls.PRESENTACIONES:

            if presentacion in texto:

                return presentacion

        return ""

    @classmethod
    def parsear_producto(
        cls,
        texto: str
    ) -> dict:

        texto = cls.normalizar(
            texto
        )

        return {

            "texto": texto,

            "principio_activo":

                cls.obtener_principios_activos(texto)[0]

                if cls.obtener_principios_activos(texto)

                else None,

            "principios_activos":

                cls.obtener_principios_activos(texto),

            "concentraciones":

                cls.obtener_concentraciones(texto),

            "presentacion":

                cls.obtener_presentacion(texto)

        }

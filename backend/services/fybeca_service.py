import re

from datetime import datetime, UTC
from typing import List

from playwright.sync_api import (
    Page,
    TimeoutError as PlaywrightTimeoutError
)

from backend.models.producto_farmacia import ProductoFarmacia
from backend.services.parser_service import ParserService


BASE_URL = "https://www.fybeca.com"


class FybecaService:

    SEARCH_TIMEOUT = 30000
    DETAIL_TIMEOUT = 30000

    @staticmethod
    def obtener_cantidad_unidades(
        nombre_producto: str
    ) -> int | None:

        texto = ParserService.normalizar(
            nombre_producto
        )

        patrones = [

            r"\bC\s*/\s*(\d+)\b",
            r"\bC\s*X\s*(\d+)\b",
            r"\bCJA\s*X\s*(\d+)\b",
            r"\bCAJA\s*X\s*(\d+)\b",
            r"\bBLISTER\s*X\s*(\d+)\b"

        ]

        for patron in patrones:

            coincidencia = re.search(
                patron,
                texto
            )

            if coincidencia:

                cantidad = int(
                    coincidencia.group(1)
                )

                if cantidad > 1:

                    return cantidad

        return None

    @staticmethod
    def calcular_precio_unitario(
        nombre_producto: str,
        precio: float
    ) -> float:

        cantidad = FybecaService.obtener_cantidad_unidades(
            nombre_producto
        )

        if cantidad:

            return round(
                precio / cantidad,
                4
            )

        return precio

    @staticmethod
    def es_ficha_producto(
        page: Page
    ) -> bool:

        if "/busqueda" not in page.url and ".html" in page.url:

            return True

        try:

            return page.locator(
                ".product-detail, h1.product-name"
            ).count() > 0

        except Exception:

            return False

    @staticmethod
    def extraer_producto_actual(
        page: Page
    ) -> dict | None:

        try:

            nombre = page.locator(
                "h1.product-name"
            ).first.inner_text().strip()

        except Exception:

            try:

                nombre = page.title().strip()

            except Exception:

                return None

        marca = ""

        try:

            marca = page.locator(
                ".product-brand"
            ).first.inner_text().strip()

        except Exception:

            pass

        precio = None

        try:

            precio = float(

                page.locator(
                    ".prices .large-price .value"
                ).first.get_attribute(
                    "content"
                )

            )

        except Exception:

            try:

                texto_precio = page.locator(
                    ".prices .large-price .value"
                ).first.inner_text()

                texto_precio = (
                    texto_precio
                    .replace("$", "")
                    .replace(",", "")
                    .strip()
                )

                precio = float(texto_precio)

            except Exception:

                return None

        return {

            "nombre": nombre,

            "marca": marca,

            "precio": precio,

            "url": page.url

        }

    @staticmethod
    def buscar_productos(
        page: Page,
        nombre_medicamento: str
    ) -> list[dict]:

        url = (
            f"{BASE_URL}/busqueda"
            f"?q={nombre_medicamento}"
        )

        page.goto(
            url,
            wait_until="networkidle",
            timeout=FybecaService.SEARCH_TIMEOUT
        )

        if FybecaService.es_ficha_producto(page):

            producto = FybecaService.extraer_producto_actual(page)

            if producto:

                return [
                    producto
                ]

        # --------------------------------------------------
        # Verificar si no existen resultados
        # --------------------------------------------------

        try:

            mensaje = page.locator("p.no-results-message")

            if mensaje.count() > 0:

                texto = mensaje.first.inner_text().strip().lower()

                if "no encontramos resultados" in texto:

                    return []

        except Exception:

            pass

        # --------------------------------------------------
        # Continuar normalmente
        # --------------------------------------------------

        try:

            page.wait_for_selector(
                (
                    "p.no-results-message, "
                    ".product-detail, "
                    "h1.product-name, "
                    ".products-grid .product.product-wrapper"
                ),
                timeout=FybecaService.SEARCH_TIMEOUT
            )

        except PlaywrightTimeoutError:

            return []

        if FybecaService.es_ficha_producto(page):

            producto = FybecaService.extraer_producto_actual(page)

            if producto:

                return [
                    producto
                ]

        mensaje = page.locator("p.no-results-message")

        if mensaje.count() > 0:

            texto = mensaje.first.inner_text().strip().lower()

            if "no encontramos resultados" in texto:

                return []

        productos = page.locator(
            ".products-grid .product.product-wrapper"
        )

        resultados = []

        for i in range(productos.count()):

            try:

                producto = productos.nth(i)

                nombre = producto.locator(
                    ".pdp-link a.link"
                ).inner_text().strip()

                enlace = producto.locator(
                    ".pdp-link a.link"
                ).get_attribute(
                    "href"
                )

                marca = ""

                try:

                    marca = producto.locator(
                        "a.product-brand"
                    ).inner_text().strip()

                except Exception:

                    pass

                precio = None

                try:

                    precio = float(

                        producto.locator(
                            ".large-price .value"
                        ).get_attribute(
                            "content"
                        )

                    )

                except Exception:

                    try:

                        texto_precio = producto.locator(
                            ".large-price .value"
                        ).inner_text()

                        texto_precio = (
                            texto_precio
                            .replace("$", "")
                            .replace(",", "")
                            .strip()
                        )

                        precio = float(texto_precio)

                    except Exception:

                        continue

                resultados.append({

                    "nombre": nombre,

                    "marca": marca,

                    "precio": precio,

                    "url": BASE_URL + enlace

                })

            except Exception:

                continue

        return resultados

    @staticmethod
    def leer_ficha_tecnica(
        page: Page,
        url: str
    ) -> dict:

        page.goto(
            url,
            wait_until="networkidle",
            timeout=FybecaService.DETAIL_TIMEOUT
        )

        ficha = {}

        try:

            page.wait_for_selector(
                "table tbody tr",
                timeout=5000
            )

            filas = page.locator(
                "table tbody tr"
            )

            for i in range(filas.count()):

                try:

                    fila = filas.nth(i)

                    clave = fila.locator(
                        "th"
                    ).inner_text().strip()

                    valor = fila.locator(
                        "td"
                    ).inner_text().strip()

                    ficha[clave] = valor

                except Exception:

                    continue

        except PlaywrightTimeoutError:

            pass

        return ficha

    @staticmethod
    def leer_beneficios(
        page: Page
    ) -> str:

        selectores = [

            ".tab1Content",
            ".info-content-collapse",
            ".product-detail",
            ".product-long-description",
            ".description",
            ".ingredients",
            ".additional-information",
            ".product-attributes",
            "table"

        ]

        textos = []

        for selector in selectores:

            try:

                elementos = page.locator(
                    selector
                )

                for i in range(elementos.count()):

                    texto = elementos.nth(i).inner_text().strip()

                    if texto and texto not in textos:

                        textos.append(
                            texto
                        )

            except Exception:

                continue

        return " ".join(
            textos
        )

    @staticmethod
    def extraer_campos(
        ficha: dict,
        beneficios: str
    ) -> dict:

        texto = " ".join([

            " ".join(
                [
                    f"{clave} {valor}"
                    for clave, valor in ficha.items()
                ]
            ),

            beneficios

        ])

        datos = ParserService.parsear_producto(
            texto
        )

        return {

            "principio_activo": datos.get(
                "principio_activo"
            ),

            "principios_activos": datos.get(
                "principios_activos",
                []
            ),

            "concentraciones": datos.get(
                "concentraciones",
                []
            ),

            "presentacion": datos.get(
                "presentacion"
            ),

            "marca": ficha.get(
                "Marca"
            ),

            "laboratorio": ficha.get(
                "Laboratorio"
            )

        }


    @classmethod
    def construir_producto(
        cls,
        producto: dict,
        ficha: dict,
        beneficios: str
    ) -> ProductoFarmacia:

        datos = cls.extraer_campos(

            ficha,

            beneficios

        )

        texto_producto = " ".join(
            [
                producto["nombre"],
                beneficios
            ]
        )

        datos_nombre = ParserService.parsear_producto(
            texto_producto
        )

        principios_activos = datos[
            "principios_activos"
        ]

        for principio_activo in datos_nombre[
            "principios_activos"
        ]:

            if principio_activo not in principios_activos:

                principios_activos.append(
                    principio_activo
                )

        concentraciones = datos[
            "concentraciones"
        ]

        for concentracion in datos_nombre[
            "concentraciones"
        ]:

            if concentracion not in concentraciones:

                concentraciones.append(
                    concentracion
                )

        presentacion = (

            datos[
                "presentacion"
            ]

            or

            datos_nombre[
                "presentacion"
            ]

        )

        return ProductoFarmacia(

            farmacia="Fybeca",

            nombre_producto=producto["nombre"],

            principio_activo=datos[
                "principio_activo"
            ] or datos_nombre[
                "principio_activo"
            ],

            principios_activos=principios_activos,

            concentraciones=concentraciones,

            presentacion=presentacion,

            marca=datos[
                "marca"
            ] or producto.get(
                "marca"
            ),

            laboratorio=datos[
                "laboratorio"
            ],

            precio=cls.calcular_precio_unitario(
                producto["nombre"],
                producto["precio"]
            ),

            url=producto[
                "url"
            ],

            score=None,

            ultima_actualizacion=datetime.now(
                UTC
            )

        )

    @classmethod
    def obtener_productos(
        cls,
        page: Page,
        nombre_medicamento: str
    ) -> List[ProductoFarmacia]:

        candidatos = cls.buscar_productos(

            page,

            nombre_medicamento

        )

        productos: List[ProductoFarmacia] = []

        print(
            f"Productos encontrados: {len(candidatos)}"
        )

        for indice, candidato in enumerate(candidatos, start=1):

            try:

                ficha = cls.leer_ficha_tecnica(

                    page,

                    candidato["url"]

                )

                beneficios = cls.leer_beneficios(
                    page
                )

                producto = cls.construir_producto(

                    candidato,

                    ficha,

                    beneficios

                )

                productos.append(
                    producto
                )

            except PlaywrightTimeoutError:

                print(

                    f"Timeout leyendo "
                    f"{candidato['nombre']}"

                )

                continue

            except Exception as e:

                print(

                    f"Error procesando "
                    f"{candidato['nombre']}: {e}"

                )

                continue

        return productos

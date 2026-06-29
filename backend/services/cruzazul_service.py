import re

from datetime import datetime, UTC
from typing import List

from playwright.sync_api import (
    Page,
    TimeoutError as PlaywrightTimeoutError
)

from backend.models.producto_farmacia import ProductoFarmacia
from backend.services.parser_service import ParserService


BASE_URL = "https://www.farmaciascruzazul.ec"


class CruzAzulService:

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

        cantidad = CruzAzulService.obtener_cantidad_unidades(
            nombre_producto
        )

        if cantidad:

            return round(
                precio / cantidad,
                4
            )

        return precio

    @staticmethod
    def normalizar_url(
        enlace: str
    ) -> str:

        if enlace.startswith("http"):

            return enlace

        return BASE_URL + enlace

    @staticmethod
    def texto_visible(
        page: Page,
        selectores: list[str]
    ) -> str:

        for selector in selectores:

            try:

                elemento = page.locator(
                    selector
                ).first

                if elemento.count() > 0 and elemento.is_visible():

                    texto = elemento.inner_text().strip()

                    if texto:

                        return texto

            except Exception:

                continue

        return ""

    @staticmethod
    def parsear_precio(
        texto: str
    ) -> float | None:

        if not texto:

            return None

        texto = (
            texto
            .replace("$", "")
            .replace("USD", "")
            .replace(" ", "")
            .strip()
        )

        texto = re.sub(
            r"[^0-9,.]",
            "",
            texto
        )

        if not texto:

            return None

        if "," in texto and "." in texto:

            texto = texto.replace(
                ",",
                ""
            )

        else:

            texto = texto.replace(
                ",",
                "."
            )

        try:

            return float(
                texto
            )

        except Exception:

            return None

    @staticmethod
    def obtener_precio_actual(
        page: Page
    ) -> float | None:

        try:

            entero = page.locator(
                ".pharmacys-product-price-1-x-currencyInteger"
            ).first.inner_text().strip()

            decimal = page.locator(
                ".pharmacys-product-price-1-x-currencyFraction"
            ).first.inner_text().strip()

            return float(
                f"{entero}.{decimal}"
            )

        except Exception:

            pass

        selectores = [

            ".pharmacys-product-price-1-x-sellingPrice",
            ".pharmacys-product-price-1-x-currencyContainer",
            "[class*='sellingPrice']",
            "[class*='currencyContainer']"

        ]

        for selector in selectores:

            try:

                elementos = page.locator(
                    selector
                )

                for i in range(elementos.count()):

                    precio = CruzAzulService.parsear_precio(
                        elementos.nth(i).inner_text()
                    )

                    if precio is not None:

                        return precio

            except Exception:

                continue

        return None

    @staticmethod
    def es_ficha_producto(
        page: Page
    ) -> bool:

        if "/p" in page.url:

            return True

        try:

            nombre = page.locator(
                ".vtex-store-components-3-x-productBrand"
            ).first

            precio = page.locator(
                ".pharmacys-product-price-1-x-currencyInteger, "
                ".pharmacys-product-price-1-x-sellingPrice"
            ).first

            return (
                nombre.count() > 0
                and
                nombre.is_visible()
                and
                precio.count() > 0
                and
                precio.is_visible()
            )

        except Exception:

            return False

    @staticmethod
    def extraer_producto_actual(
        page: Page
    ) -> dict | None:

        nombre = CruzAzulService.texto_visible(
            page,
            [
                ".vtex-store-components-3-x-productBrand",
                ".vtex-store-components-3-x-productNameContainer",
                "h1"
            ]
        )

        if not nombre:

            try:

                nombre = page.title().strip()

            except Exception:

                return None

        precio = CruzAzulService.obtener_precio_actual(
            page
        )

        if precio is None:

            return None

        return {

            "nombre": nombre,

            "precio": precio,

            "url": page.url

        }

    @staticmethod
    def buscar_productos(
        page: Page,
        nombre_medicamento: str
    ) -> list[dict]:

        url = (
            f"{BASE_URL}/"
            f"{nombre_medicamento.lower()}"
            f"?_q={nombre_medicamento}"
            f"&map=ft"
        )

        page.goto(
            url,
            wait_until="networkidle",
            timeout=CruzAzulService.SEARCH_TIMEOUT
        )

        if CruzAzulService.es_ficha_producto(page):

            producto = CruzAzulService.extraer_producto_actual(page)

            if producto:

                return [
                    producto
                ]

        try:

            page.wait_for_selector(
                (
                    ".vtex-search-result-3-x-notFound, "
                    ".vtex-search-result-3-x-gallery "
                    ".vtex-product-summary-2-x-container, "
                    ".vtex-store-components-3-x-productBrand"
                ),
                timeout=CruzAzulService.SEARCH_TIMEOUT
            )

        except PlaywrightTimeoutError:

            return []

        if CruzAzulService.es_ficha_producto(page):

            producto = CruzAzulService.extraer_producto_actual(page)

            if producto:

                return [
                    producto
                ]

        try:

            sin_resultados = page.locator(
                ".vtex-search-result-3-x-notFound"
            )

            if sin_resultados.count() > 0 and sin_resultados.first.is_visible():

                return []

        except Exception:

            pass

        productos = page.locator(
            (
                ".vtex-search-result-3-x-gallery "
                ".vtex-product-summary-2-x-container"
            )
        )

        resultados = []

        for i in range(productos.count()):

            try:

                producto = productos.nth(i)

                nombre = producto.locator(
                    "h3"
                ).inner_text().strip()

                enlace = producto.locator(
                    "a"
                ).first.get_attribute(
                    "href"
                )

                if not nombre or not enlace:

                    continue

                resultados.append({

                    "nombre": nombre,

                    "url": CruzAzulService.normalizar_url(
                        enlace
                    )

                })

            except Exception:

                continue

        return resultados

    @staticmethod
    def leer_producto(
        page: Page,
        url: str
    ) -> dict:

        if page.url != url:

            page.goto(
                url,
                wait_until="networkidle",
                timeout=CruzAzulService.DETAIL_TIMEOUT
            )

        producto = CruzAzulService.extraer_producto_actual(
            page
        )

        if not producto:

            raise PlaywrightTimeoutError(
                "No se pudo leer la ficha del producto"
            )

        return {

            "nombre": producto[
                "nombre"
            ],

            "precio": producto[
                "precio"
            ],

            "url": producto[
                "url"
            ]

        }

    @staticmethod
    def leer_especificaciones(
        page: Page
    ) -> dict:

        especificaciones = {}

        try:

            page.wait_for_selector(

                ".vtex-flex-layout-0-x-flexRow--productSpecification-pdp",

                timeout=5000

            )

            filas = page.locator(

                ".vtex-flex-layout-0-x-flexRow--productSpecification-pdp"

            )

            for i in range(filas.count()):

                try:

                    fila = filas.nth(i)

                    clave = fila.locator(

                        ".vtex-product-specifications-1-x-specificationName"

                    ).inner_text().strip()

                    valor = fila.locator(

                        ".vtex-product-specifications-1-x-specificationValue"

                    ).inner_text().strip()

                    especificaciones[clave] = valor

                except Exception:

                    continue

        except PlaywrightTimeoutError:

            pass

        return especificaciones

    @staticmethod
    def leer_texto_tecnico(
        page: Page
    ) -> str:

        selectores = [

            ".vtex-store-components-3-x-productDescriptionText",
            ".vtex-product-specifications-1-x-specificationValue",
            ".vtex-product-specifications-1-x-specificationName",
            ".vtex-flex-layout-0-x-flexRow--productSpecification-pdp",
            ".vtex-store-components-3-x-container",
            "[class*='productSpecification']",
            "[class*='productDescription']",
            "[class*='description']",
            "[class*='ingredients']",
            "[class*='warning']",
            "[class*='legal']",
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
        producto: dict,
        especificaciones: dict
    ) -> dict:

        texto = " ".join([

            producto["nombre"],

            " ".join(
                [
                    f"{clave} {valor}"
                    for clave, valor in especificaciones.items()
                ]
            ),

            producto.get(
                "texto",
                ""
            )

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
            )

        }

    @classmethod
    def construir_producto(
        cls,
        producto: dict,
        especificaciones: dict
    ) -> ProductoFarmacia:

        datos = cls.extraer_campos(

            producto,

            especificaciones

        )

        datos_nombre = ParserService.parsear_producto(
            " ".join(
                [
                    producto["nombre"],
                    producto.get(
                        "texto",
                        ""
                    )
                ]
            )
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

            farmacia="Cruz Azul",

            nombre_producto=producto["nombre"],

            principio_activo=datos[
                "principio_activo"
            ] or datos_nombre[
                "principio_activo"
            ],

            principios_activos=principios_activos,

            concentraciones=concentraciones,

            presentacion=presentacion,

            marca=(
                especificaciones.get("Marca")
                or
                especificaciones.get("Laboratorio")
            ),

            laboratorio=especificaciones.get(
                "Laboratorio"
            ),

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

        for indice, candidato in enumerate(
            candidatos,
            start=1
        ):

            try:

                datos = cls.leer_producto(

                    page,

                    candidato["url"]

                )

                datos["url"] = candidato[
                    "url"
                ]

                especificaciones = cls.leer_especificaciones(
                    page
                )

                datos["texto"] = cls.leer_texto_tecnico(
                    page
                )

                producto = cls.construir_producto(

                    datos,

                    especificaciones

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

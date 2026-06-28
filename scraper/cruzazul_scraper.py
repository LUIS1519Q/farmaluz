from playwright.sync_api import sync_playwright
import requests
from datetime import datetime, UTC
from backend.services.medicamentos_service import obtener_medicamentos


def obtener_precio_cruzazul(nombre_medicamento):

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        page = browser.new_page()

        url_busqueda = (
            f"https://www.farmaciascruzazul.ec/{nombre_medicamento.lower()}?_q={nombre_medicamento}&map=ft"
        )

        page.goto(url_busqueda)

        page.wait_for_timeout(5000)

        productos = page.locator(
            ".vtex-search-result-3-x-galleryItem"
        )

        if productos.count() == 0:
            browser.close()
            return None

        print(f"\nBuscando: {nombre_medicamento}")
        print(f"Productos encontrados: {productos.count()}")

        for i in range(productos.count()):

            producto = productos.nth(i)

            try:

                nombre_producto = producto.locator(
                    ".vtex-product-summary-2-x-productBrand"
                ).inner_text().strip()

                print(f"Producto {i+1}: {nombre_producto}")

                if nombre_medicamento.upper() not in nombre_producto.upper():
                    continue

                entero = producto.locator(
                    ".pharmacys-product-price-1-x-currencyInteger"
                ).inner_text()

                decimal = producto.locator(
                    ".pharmacys-product-price-1-x-currencyFraction"
                ).inner_text()

                precio = float(f"{entero}.{decimal}")

                enlace = producto.locator(
                    "a.vtex-product-summary-2-x-clearLink"
                ).get_attribute("href")

                browser.close()

                return {
                    "medicamento_id": None,
                    "farmacia": "Cruz Azul",
                    "nombre_producto": nombre_producto,
                    "precio": precio,
                    "url": f"https://www.farmaciascruzazul.ec{enlace}"
                }

            except Exception as e:

                print(e)

                continue

        browser.close()

        return None


def guardar_precio(resultado):

    response = requests.post(
        "http://127.0.0.1:8000/precios/",
        json=resultado
    )

    return response.json()


def ejecutar_cruzazul():

    medicamentos = obtener_medicamentos(
        limite=5
    )

    for medicamento in medicamentos:

        nombre = medicamento["Principio Activo"]

        print("=" * 70)
        print("ID:", medicamento["_id"])
        print("Medicamento:", nombre)

        resultado = obtener_precio_cruzazul(
            nombre
        )

        print("Resultado:", resultado)

        if resultado is None:
            print("No se guardó en MongoDB")
            continue

        resultado["medicamento_id"] = str(
            medicamento["_id"]
        )

        resultado["ultima_actualizacion"] = datetime.now(UTC).isoformat()

        respuesta = guardar_precio(
            resultado
        )

        print("API:", respuesta)


if __name__ == "__main__":
    ejecutar_cruzazul()
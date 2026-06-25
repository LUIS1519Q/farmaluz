from playwright.sync_api import sync_playwright

import requests

def obtener_precio_fybeca(nombre_medicamento):

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        page = browser.new_page()

        url_busqueda = (
            f"https://www.fybeca.com/busqueda?q={nombre_medicamento}"
        )

        page.goto(url_busqueda)

        page.wait_for_timeout(5000)

        producto = page.locator(
            ".product.product-wrapper"
        ).first

        if producto.count() == 0:
            browser.close()
            return None

        precio = producto.locator(
            ".price .large-price .value"
        ).get_attribute("content")

        enlace = producto.locator(
            ".pdp-link a.link"
        ).get_attribute("href")

        browser.close()

        return {
            "farmacia": "Fybeca",
            "precio": float(precio),
            "url": f"https://www.fybeca.com{enlace}"
        }
def guardar_precio(resultado):

    response = requests.post(
        "http://127.0.0.1:8000/precios/",
        json=resultado
    )

    return response.json()

if __name__ == "__main__":

    medicamentos = [
        "paracetamol",
        "ibuprofeno",
        "amoxicilina",
        "loratadina",
        "omeprazol"
    ]

    for medicamento in medicamentos:

        resultado = obtener_precio_fybeca(
            medicamento
        )

        print("SCRAPER:")
        print(resultado)

        respuesta = guardar_precio(
            resultado
        )

        print("API:")
        print(respuesta)
        print("-" * 50)
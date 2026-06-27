from playwright.sync_api import sync_playwright
import requests

from datetime import datetime, UTC
from backend.services.medicamentos_service import obtener_medicamentos


def obtener_precio_fybeca(nombre_medicamento):

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=True)

        page = browser.new_page()

        page.goto(
            f"https://www.fybeca.com/busqueda?q={nombre_medicamento}"
        )

        page.wait_for_timeout(5000)

        productos = page.locator(".product.product-wrapper")

        if productos.count() == 0:
            browser.close()
            return None

        print(f"\nBuscando: {nombre_medicamento}")
        print(f"Productos encontrados: {productos.count()}")

        for i in range(productos.count()):

            producto = productos.nth(i)

            nombre_producto = producto.locator(
                ".pdp-link a.link"
            ).inner_text().strip()

            print(f"Producto {i+1}: {nombre_producto}")

            if nombre_medicamento.upper() not in nombre_producto.upper():
                continue

            print("Coincidencia encontrada")

            precio = producto.locator(
                ".price .large-price .value"
            ).get_attribute("content")

            enlace = producto.locator(
                ".pdp-link a.link"
            ).get_attribute("href")

            browser.close()

            return {
                "medicamento_id": None,
                "farmacia": "Fybeca",
                "nombre_producto": nombre_producto,
                "precio": float(precio),
                "url": f"https://www.fybeca.com{enlace}"
            }

        browser.close()

        return None


def guardar_precio(resultado):

    response = requests.post(
        "http://127.0.0.1:8000/precios/",
        json=resultado
    )

    return response.json()


def ejecutar_fybeca():

    medicamentos = obtener_medicamentos(limite=5)

    for medicamento in medicamentos:

        nombre = medicamento["Principio Activo"]

        print("=" * 70)
        print("ID:", medicamento["_id"])
        print("Medicamento:", nombre)

        resultado = obtener_precio_fybeca(nombre)

        print("Resultado:", resultado)

        if resultado is None:
            print("No se guardó en MongoDB")
            continue

        resultado["medicamento_id"] = str(
            medicamento["_id"]
        )

        resultado["ultima_actualizacion"] = datetime.now(UTC).isoformat()

        print(resultado)

        respuesta = guardar_precio(resultado)

        print("API:", respuesta)


if __name__ == "__main__":
    ejecutar_fybeca()
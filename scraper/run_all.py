import sys
import time

from playwright.sync_api import sync_playwright

from scraper.fybeca_scraper import (
    DEBUG,
    MAX_CONCURRENT_PAGES,
    ejecutar as ejecutar_fybeca
)
from scraper.cruzazul_scraper import ejecutar as ejecutar_cruzazul


def ejecutar() -> int:

    inicio = time.time()

    print("=" * 50)
    print("FARMALUZ SCRAPER")
    print("=" * 50)

    resumen_total = {
        "medicamentos_msp": 0,
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

    scrapers = [

        ("Fybeca", ejecutar_fybeca),

        ("Cruz Azul", ejecutar_cruzazul)

    ]

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        context = browser.new_context()

        try:

            for nombre, funcion in scrapers:

                try:

                    resumen = funcion(
                        browser=browser,
                        context=context,
                        max_concurrent_pages=MAX_CONCURRENT_PAGES,
                        debug=DEBUG
                    )

                    for clave in resumen_total:

                        if clave == "medicamentos_msp":

                            resumen_total[clave] = max(
                                resumen_total[clave],
                                resumen.get(clave, 0)
                            )

                        else:

                            resumen_total[clave] += resumen.get(
                                clave,
                                0
                            )

                except Exception as e:

                    resumen_total["errores_scraping"] += 1

                    print()
                    print(f"Error ejecutando {nombre}: {e}")

        finally:

            context.close()
            browser.close()

    tiempo_total = round(
        time.time() - inicio,
        2
    )

    print()
    print("=" * 50)
    print("Proceso finalizado")
    print(f"Tiempo total: {tiempo_total} s")
    print(f"Medicamentos MSP: {resumen_total['medicamentos_msp']}")
    print(f"Principios activos procesados: {resumen_total['principios_activos_procesados']}")
    print(f"Productos encontrados: {resumen_total['productos_encontrados']}")
    print(f"Productos analizados: {resumen_total['productos_analizados']}")
    print(f"Coincidencias válidas: {resumen_total['coincidencias_validas']}")
    print(f"Descartes por concentración: {resumen_total['descartados_concentracion']}")
    print(f"Descartes por principio activo: {resumen_total['descartados_principio']}")
    print(f"Descartes por forma farmacéutica: {resumen_total['descartados_forma']}")
    print(f"Medicamentos sin resultados: {resumen_total['medicamentos_sin_resultados']}")
    print(f"Errores de scraping: {resumen_total['errores_scraping']}")
    print(f"Medicamentos actualizados: {resumen_total['medicamentos_actualizados']}")
    if resumen_total["medicamentos_msp"]:
        print(
            "Tiempo promedio por medicamento: "
            f"{round(tiempo_total / resumen_total['medicamentos_msp'], 2)} s"
        )
    print("=" * 50)

    if resumen_total["errores_scraping"] > 0:

        return 1

    return 0


if __name__ == "__main__":

    sys.exit(
        ejecutar()
    )

import pytest
from unittest.mock import MagicMock, patch

# Importamos las funciones de los archivos 
from scraper.fybeca_scraper import obtener_precio_fybeca
from scraper.cruzazul_scraper import obtener_precio_cruzazul

@patch('scraper.fybeca_scraper.sync_playwright')
def test_obtener_precio_fybeca_exitoso(mock_playwright):
    """Prueba que el scraper de Fybeca extraiga los datos correctamente cuando hay coincidencia"""
    # Configuración del simulador del navegador y la página
    mock_browser = MagicMock()
    mock_page = MagicMock()
    mock_product = MagicMock()
    
    mock_playwright.return_value.__enter__.return_value.chromium.launch.return_value = mock_browser
    mock_browser.new_page.return_value = mock_page
    
    # Simulamos que encuentra 1 producto
    mock_page.locator.return_value.count.return_value = 1
    mock_page.locator.return_value.nth.return_value = mock_product
    
    # Simulamos los textos y atributos que el HTML real devolvería
    mock_product.locator.return_value.inner_text.return_value = "Paracetamol 500mg"
    mock_product.locator.return_value.get_attribute.side_effect = ["0.10", "/paracetamol-link"]

    # Ejecutamos la función pasándole el término de búsqueda
    resultado = obtener_precio_fybeca("Paracetamol")

    # Verificaciones (Asserts)
    assert resultado is not None
    assert resultado["farmacia"] == "Fybeca"
    assert resultado["nombre_producto"] == "Paracetamol 500mg"
    assert resultado["precio"] == 0.10
    assert "https://www.fybeca.com/paracetamol-link" in resultado["url"]


@patch('scraper.cruzazul_scraper.sync_playwright')
def test_obtener_precio_cruzazul_exitoso(mock_playwright):
    """Prueba que el scraper de Cruz Azul arme el diccionario de datos correctamente"""
    mock_browser = MagicMock()
    mock_page = MagicMock()
    mock_product = MagicMock()
    
    mock_playwright.return_value.__enter__.return_value.chromium.launch.return_value = mock_browser
    mock_browser.new_page.return_value = mock_page
    
    # Simulamos que encuentra 1 producto
    mock_page.locator.return_value.count.return_value = 1
    mock_page.locator.return_value.nth.return_value = mock_product
    
    # Simulamos el comportamiento interno del Try/Except de Cruz Azul
    # Nota: side_effect ayuda a simular las llamadas consecutivas a inner_text()
    mock_product.locator.return_value.inner_text.side_effect = ["PARACETAMOL GENÉBRES", "1", "20"]
    mock_product.locator.return_value.get_attribute.return_value = "/paracetamol-cruz-azul"

    resultado = obtener_precio_cruzazul("Paracetamol")

    assert resultado is not None
    assert resultado["farmacia"] == "Cruz Azul"
    assert resultado["precio"] == 1.20  # 1 entero y 20 decimales -> 1.20
    assert "https://www.farmaciascruzazul.ec" in resultado["url"]
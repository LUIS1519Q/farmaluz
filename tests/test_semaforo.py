import pytest
import sys
import os

# Asegurar que Python encuentre la ruta de backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_path = os.path.join(BASE_DIR, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Importamos la función desde el servicio real
from services.semaforo_service import calcular_semaforo

def test_semaforo_precio_mayor_que_techo():
    # Caso: precio_cobrado mayor que precio_techo -> ROJO con porcentaje correcto
    resultado = calcular_semaforo(precio_techo=100.0, precio_cobrado=150.0)
    assert resultado["estado"] == "ROJO"
    assert resultado["porcentaje"] == 50.0

def test_semaforo_precio_igual_a_techo():
    # Caso: precio_cobrado igual a precio_techo -> VERDE
    resultado = calcular_semaforo(precio_techo=100.0, precio_cobrado=100.0)
    assert resultado["estado"] == "VERDE"
    assert resultado["porcentaje"] == 0.0

def test_semaforo_precio_menor_que_techo():
    # Caso: precio_cobrado menor que precio_techo -> VERDE
    resultado = calcular_semaforo(precio_techo=100.0, precio_cobrado=80.0)
    assert resultado["estado"] == "VERDE"
    assert resultado["porcentaje"] == 0.0
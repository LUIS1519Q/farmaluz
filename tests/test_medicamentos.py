import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

# Asegurar que Python encuentre la ruta de backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_path = os.path.join(BASE_DIR, 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from main import app 

@pytest.mark.asyncio
async def test_read_root():
    # Usamos ASGITransport para las versiones modernas de httpx
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_all_medicamentos():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        try:
            response = await ac.get("/medicamentos/")
            assert response.status_code == 200
            assert isinstance(response.json(), list)
        except Exception as e:
            if "ServerSelectionTimeoutError" in str(type(e)):
                pytest.skip("Base de datos MongoDB local apagada o no accesible")
            raise e

@pytest.mark.asyncio
async def test_get_medicamento_by_id_valido():
    transport = ASGITransport(app=app)
    id_valido_mock = "65f3c5b2d2f1a3e4b5c6d7e8" 
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        try:
            response = await ac.get(f"/medicamentos/{id_valido_mock}")
            assert response.status_code in [200, 404]
        except Exception as e:
            if "ServerSelectionTimeoutError" in str(type(e)):
                pytest.skip("Base de datos MongoDB local apagada o no accesible")
            raise e

@pytest.mark.asyncio
async def test_get_medicamento_by_id_invalido():
    transport = ASGITransport(app=app)
    id_inexistente = "999999999999999999999999" 
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        try:
            response = await ac.get(f"/medicamentos/{id_inexistente}")
            assert response.status_code == 404
        except Exception as e:
            if "ServerSelectionTimeoutError" in str(type(e)):
                pytest.skip("Base de datos MongoDB local apagada o no accesible")
            raise e
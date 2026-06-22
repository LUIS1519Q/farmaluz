from fastapi import APIRouter

router = APIRouter(
    prefix="/precios",
    tags=["Precios"]
)

precios_mock = []


@router.get("/{medicamento_id}")
def obtener_precio(medicamento_id: str):

    return {
        "medicamento_id": medicamento_id,
        "precio_techo": None,
        "precio_farmacia": None
    }


@router.post("/")
def registrar_precio(precio: dict):

    precios_mock.append(precio)

    return {
        "mensaje": "Precio registrado",
        "data": precio
    }
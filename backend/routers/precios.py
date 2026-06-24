from fastapi import APIRouter
from backend.database import db

router = APIRouter(
    prefix="/precios",
    tags=["Precios"]
)


@router.get("/{medicamento_id}")
def obtener_precio(medicamento_id: str):

    return {
        "medicamento_id": medicamento_id,
        "precio_techo": None,
        "precio_farmacia": None
    }



@router.post("/")
def registrar_precio(precio: dict):

    resultado = db.precios.insert_one(precio)

    return {
        "mensaje": "Precio registrado",
        "id": str(resultado.inserted_id)
    }
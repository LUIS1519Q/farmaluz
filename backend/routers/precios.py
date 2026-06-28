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

    db.precios.update_one(
        {
            "medicamento_id": precio["medicamento_id"],
            "farmacia": precio["farmacia"]
        },
        {
            "$set": precio
        },
        upsert=True
    )

    return {
        "mensaje": "Precio registrado"
    }
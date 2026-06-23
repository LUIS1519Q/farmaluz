from fastapi import APIRouter, HTTPException
from bson import ObjectId

from backend.database import db

from backend.models import MedicamentoGenerico # Asegúrate de este import arriba

router = APIRouter(
    prefix="/medicamentos",
    tags=["Medicamentos"]
)

# 1. Endpoint de Genéricos (Integrado con el modelo)
@router.get("/genericos/{id}", response_model=MedicamentoGenerico)
def obtener_generico(id: int):
    # Aquí puedes añadir la lógica de DB real cuando la tengas
    return {
        "id": id,
        "nombre": "Paracetamol",
        "principio_activo": "Paracetamol",
        "precio_techo": 0.50,
        "farmacia": "Farmacia Central"
    }

@router.get("/")
def listar_medicamentos(nombre: str | None = None):

    filtro = {}

    if nombre:
        filtro["principio_activo"] = {
            "$regex": nombre,
            "$options": "i"
        }

    medicamentos = []

    for med in db.medicamentos.find(filtro):

        med["_id"] = str(med["_id"])

        medicamentos.append(med)

    return medicamentos


@router.get("/{medicamento_id}")
def obtener_medicamento(medicamento_id: str):

    medicamento = db.medicamentos.find_one(
        {"_id": ObjectId(medicamento_id)}
    )

    if not medicamento:
        raise HTTPException(
            status_code=404,
            detail="Medicamento no encontrado"
        )

    medicamento["_id"] = str(medicamento["_id"])

    return medicamento


@router.post("/")
def crear_medicamento(medicamento: dict):

    resultado = db.medicamentos.insert_one(medicamento)

    return {
        "id": str(resultado.inserted_id),
        "mensaje": "Medicamento creado"
    }

# Asegúrate de añadir esto a tu router en medicamentos.py

@router.get("/genericos/{id}", tags=["Medicamentos"])
def obtener_generico(id: str):
    # Aquí irá tu lógica. Por ahora, un mock simple:
    return {
        "id": id,
        "nombre": "Medicamento Genérico Mock",
        "disponible": True
    }
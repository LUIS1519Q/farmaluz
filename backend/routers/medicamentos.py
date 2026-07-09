from fastapi import APIRouter, HTTPException
from bson import ObjectId

from backend.database import db
from backend.models import Medicamento

router = APIRouter(
    prefix="/medicamentos",
    tags=["Medicamentos"]
)


@router.get("/genericos/{id}", response_model=Medicamento)
def obtener_generico(id: int): 
    generico = db.genericos.find_one({"id": id})
    
    if not generico:
        raise HTTPException(status_code=404, detail="Medicamento genérico no encontrado")
    
    generico["id"] = generico["id"] 
    return generico

@router.post("/genericos/")
def crear_generico(medicamento: Medicamento):
    # Guardamos específicamente en la colección 'genericos'
    resultado = db.genericos.insert_one(medicamento.model_dump()) 
    return {
        "id": medicamento.id, 
        "mensaje": "Genérico creado correctamente"
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
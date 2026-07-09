from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from typing import Optional
from backend.database import db

router = APIRouter(
    prefix="/medicamentos",
    tags=["Medicamentos"]
)

@router.get("/con-precio")
def medicamentos_con_precio(farmacia: Optional[str] = Query(None)):
    filtro = {}
    if farmacia:
        filtro["farmacia"] = farmacia
    
    precios = list(db.precios.find(filtro, {"medicamento_id": 1, "farmacia": 1}))
    ids = list(set([p["medicamento_id"] for p in precios if "medicamento_id" in p]))
    
    medicamentos = []
    for med_id in ids:
        try:
            med = db.medicamentos.find_one({"_id": ObjectId(med_id)})
            if med:
                med["_id"] = str(med["_id"])
                medicamentos.append(med)
        except:
            continue
    
    return medicamentos

@router.get("/")
def listar_medicamentos(nombre: str | None = None):
    filtro = {}
    if nombre:
        filtro["Principio Activo"] = {
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
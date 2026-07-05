from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from database import db

router = APIRouter(tags=["Auditoria"])

class AuditoriaEntry(BaseModel):
    medicamento_id: str
    nombre: str
    precio_techo: float
    precio_cobrado: float
    estado_semaforo: str
    porcentaje: float
    farmacia: str

@router.post("/auditoria")
def registrar_auditoria(entry: AuditoriaEntry):
    documento = {
        "medicamento_id": entry.medicamento_id,
        "nombre": entry.nombre,
        "precio_techo": entry.precio_techo,
        "precio_cobrado": entry.precio_cobrado,
        "estado_semaforo": entry.estado_semaforo,
        "porcentaje": entry.porcentaje,
        "farmacia": entry.farmacia,
        "fecha_consulta": datetime.utcnow()
    }
    resultado = db["auditoria"].insert_one(documento)
    return {
        "mensaje": "Consulta registrada correctamente",
        "id": str(resultado.inserted_id)
    }
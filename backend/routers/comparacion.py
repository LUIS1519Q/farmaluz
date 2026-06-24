from fastapi import APIRouter, HTTPException
from bson import ObjectId
from backend.services.semaforo_service import calcular_semaforo
from backend.database import db

router = APIRouter(tags=["Comparacion"])

@router.get("/comparacion/{medicamento_id}")
def comparar_precio(medicamento_id: str, precio_cobrado: float):
    # Buscar medicamento en MongoDB
    medicamento = db["medicamentos"].find_one({"_id": ObjectId(medicamento_id)})
    
    if not medicamento:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    
    # Buscar la clave de precio techo sin importar espacios
    precio_techo_str = "0"
    for key in medicamento.keys():
        if "Precio Techo" in key:
            precio_techo_str = medicamento[key]
            break

    precio_techo = float(precio_techo_str.replace("$", "").strip())

    if precio_techo == 0:
        raise HTTPException(status_code=422, detail="Precio techo no disponible para este medicamento")

    resultado = calcular_semaforo(precio_techo, precio_cobrado)
    
    return {
        "medicamento_id": medicamento_id,
        "nombre": medicamento.get("Principio Activo", "Sin nombre"),
        "concentracion": medicamento.get("Concentración", ""),
        "precio_techo": precio_techo,
        "precio_cobrado": precio_cobrado,
        "semaforo": resultado
    }
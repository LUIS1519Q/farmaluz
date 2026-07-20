from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from typing import Optional
from backend.services.semaforo_service import calcular_semaforo
from backend.database import db
from pymongo import ASCENDING

router = APIRouter(tags=["Comparacion"])

@router.get("/comparacion/{medicamento_id}")
def comparar_precio(medicamento_id: str, farmacia: Optional[str] = Query(None)):
    medicamento = db["medicamentos"].find_one({"_id": ObjectId(medicamento_id)})
    
    if not medicamento:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    
    query_precio = {"medicamento_id": medicamento_id}
    if farmacia:
        query_precio["farmacia"] = farmacia
    
    precio_doc = db["precios"].find_one(query_precio)
    
    if not precio_doc:
        raise HTTPException(status_code=404, detail="Precio no disponible para este medicamento")
    
    precio_techo_str = "0"
    for key in medicamento.keys():
        if "Precio Techo" in key:
            precio_techo_str = medicamento[key]
            break

    precio_techo = float(precio_techo_str.replace("$", "").strip())

    if precio_techo == 0:
        raise HTTPException(status_code=422, detail="Precio techo no disponible para este medicamento")

    precio_cobrado = float(precio_doc["precio"])
    resultado = calcular_semaforo(precio_techo, precio_cobrado)
    
    principio_activo_original = medicamento.get("Principio Activo", "")

    cursor_genericos = db["genericos"].find(
        {"principio_activo": principio_activo_original}
    ).sort("precio_referencial", ASCENDING)
    
    lista_genericos = []
    for gen in cursor_genericos:
        if "_id" in gen:
            del gen["_id"]
        lista_genericos.append(gen)

    ahorro_estimado = 0.0
    if len(lista_genericos) > 0:
        generico_mas_barato = lista_genericos[0]["precio_referencial"]
        ahorro_estimado = precio_cobrado - generico_mas_barato
        if ahorro_estimado < 0:
            ahorro_estimado = 0.0

    return {
        "medicamento_id": medicamento_id,
        "nombre": medicamento.get("Principio Activo", "Sin nombre"),
        "concentracion": medicamento.get("Concentración", ""),
        "farmacia": precio_doc.get("farmacia", ""),
        "laboratorio": precio_doc.get("laboratorio") or "No disponible",
        "fecha_elaboracion": precio_doc.get("fecha_elaboracion") or "No disponible",
        "fecha_vencimiento": precio_doc.get("fecha_vencimiento") or "No disponible",
        "dosificacion": precio_doc.get("dosificacion") or "No disponible",
        "tipo_presentacion": precio_doc.get("tipo_presentacion") or "No disponible",
        "precio_techo": precio_techo,
        "precio_cobrado": precio_cobrado,
        "semaforo": resultado,
        "ahorro_estimado": round(ahorro_estimado, 2),
        "alternativas_genericas": lista_genericos,
        "url_producto": precio_doc.get("url", "#"),
        "ultima_actualizacion": precio_doc.get("ultima_actualizacion", "Fecha no disponible")
    }
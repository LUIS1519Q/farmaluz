from fastapi import APIRouter, HTTPException
from bson import ObjectId
from services.semaforo_service import calcular_semaforo
from database import db
from pymongo import ASCENDING

router = APIRouter(tags=["Comparacion"])

@router.get("/comparacion/{medicamento_id}")
def comparar_precio(medicamento_id: str):
    # Buscar medicamento en MongoDB
    medicamento = db["medicamentos"].find_one({"_id": ObjectId(medicamento_id)})
    
    if not medicamento:
        raise HTTPException(status_code=404, detail="Medicamento no encontrado")
    
    # Buscar precio cobrado en la colección precios
    precio_doc = db["precios"].find_one({"medicamento_id": medicamento_id})
    
    if not precio_doc:
        raise HTTPException(status_code=404, detail="Precio no disponible para este medicamento")
    
    # Buscar precio techo sin importar espacios en el nombre del campo
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
    
# Extraemos el principio activo del original para buscar sus pares
    principio_activo_original = medicamento.get("Principio Activo", "")

    cursor_genericos = db["genericos"].find(
        {"principio_activo": principio_activo_original}
    ).sort("precio_referencial", ASCENDING)
    
    lista_genericos = []
    for gen in cursor_genericos:
        # Eliminamos el _id de Mongo para evitar errores 500 al retornar el JSON
        if "_id" in gen:
            del gen["_id"]
        lista_genericos.append(gen)

    ahorro_estimado = 0.0
    if len(lista_genericos) > 0:
        # Como está ordenado, el índice 0 es garantizado el más barato
        generico_mas_barato = lista_genericos[0]["precio_referencial"]
        
        # Ahorro = Precio que le cobran - Precio del genérico
        ahorro_estimado = precio_cobrado - generico_mas_barato
        
        # Validación de seguridad: si el genérico es más caro, el ahorro es 0
        if ahorro_estimado < 0:
            ahorro_estimado = 0.0

    #  Retornar todo en la respuesta final
    return {
    "medicamento_id": medicamento_id,
    "nombre": medicamento.get("Principio Activo", "Sin nombre"),
    "concentracion": medicamento.get("Concentración", ""),
    "farmacia": precio_doc.get("farmacia", ""),
    "precio_techo": precio_techo,
    "precio_cobrado": precio_cobrado,
    "semaforo": resultado,
    "ahorro_estimado": round(ahorro_estimado, 2),
    "alternativas_genericas": lista_genericos,
    "url_producto": precio_doc.get("url", "#"),
    "ultima_actualizacion": precio_doc.get("ultima_actualizacion", "Fecha no disponible")
}
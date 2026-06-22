from fastapi import APIRouter
from pydantic import BaseModel
# Importamos la lógica real de Gemini
from backend.chatbot.gemini_service import obtener_respuesta_gemini
from backend.database import db
# Modelo para validar la entrada
class ConsultaChatbot(BaseModel):
    pregunta: str

router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"]
)

@router.post("/consulta")
async def consultar_chatbot(consulta: ConsultaChatbot):
    # Llamamos a la función real de Gemini en lugar de la respuesta fija
    respuesta_ia = obtener_respuesta_gemini(consulta.pregunta)
    
    return {
        "pregunta": consulta.pregunta,
        "respuesta": respuesta_ia
    }
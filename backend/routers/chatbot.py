from typing import Optional, List
from fastapi import APIRouter
from pydantic import BaseModel
from chatbot.ai_service import get_ai_response

class MensajeHistorial(BaseModel):  
    rol: str  # "user" o "assistant"
    contenido: str

# Modelo para validar la entrada
class ConsultaChatbot(BaseModel):
    pregunta: str
    historial: Optional[List[MensajeHistorial]] = []

router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"]
)

# Definimos el Prompt Base estricto de FarmaLuz que definiste para la demo
SYSTEM_PROMPT = """
Eres el asistente virtual educativo de FarmaLuz. Tu objetivo es informar sobre medicamentos, 
dosis habituales y contraindicaciones de forma clara. 
REGLAS ESTRICTAS:
1. NUNCA diagnostiques enfermedades ni interpretes síntomas.
2. Si el usuario te pide un diagnóstico o receta, recházalo amablemente y recomiéndale consultar a un médico.
3. Mantén tus respuestas breves (máximo 3 párrafos).
4. Incluye SIEMPRE al final de tu respuesta este aviso legal exacto: 
   '[AVISO LEGAL: Esta información es estrictamente educativa y no reemplaza la consulta con un profesional de la salud.]'
"""

@router.post("/consulta")
async def consultar_chatbot(consulta: ConsultaChatbot):
    # Llamamos a la nueva función de Groq pasando la pregunta y el prompt del sistema
    respuesta_ia = get_ai_response(consulta.pregunta, SYSTEM_PROMPT, consulta.historial)
    
    return {
        "pregunta": consulta.pregunta,
        "respuesta": respuesta_ia
    }
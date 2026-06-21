from fastapi import APIRouter
from pydantic import BaseModel

# Modelo para validar la entrada de la pregunta
class ConsultaChatbot(BaseModel):
    pregunta: str

router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"]
)

@router.post("/consulta")
async def consultar_chatbot(consulta: ConsultaChatbot):
    # Retornamos una respuesta fija
    return {
        "pregunta": consulta.pregunta,
        "respuesta": "Esta es una respuesta de prueba del sistema FarmaLuz."
    }
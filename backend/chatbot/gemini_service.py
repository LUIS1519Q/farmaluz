import os
from dotenv import load_dotenv
from google import genai
from .prompt_base import obtener_prompt_completo

# Cargar variables de entorno
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Inicializar el cliente una sola vez al arrancar
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def obtener_respuesta_gemini(pregunta_usuario: str):
    prompt = obtener_prompt_completo(pregunta_usuario)
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error en Gemini API: {e}")
        return "Lo siento, en este momento no puedo procesar tu consulta. Por favor, intenta de nuevo en un momento."
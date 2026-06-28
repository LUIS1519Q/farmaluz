import os
from dotenv import load_dotenv
import google.generativeai as genai
from .prompt_base import obtener_prompt_completo
from google.api_core import exceptions

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
# Esta línea asegura que la API se configure al iniciar
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-3.5-flash')

def obtener_respuesta_gemini(pregunta_usuario: str):
    prompt = obtener_prompt_completo(pregunta_usuario)
    try:
        response = model.generate_content(prompt)
        return response.text
    except exceptions.ResourceExhausted:
        return "Lo siento, en este momento estoy recibiendo muchas consultas. Por favor, intenta de nuevo en un momento."
import os
from dotenv import load_dotenv
import google.generativeai as genai
from .prompt_base import obtener_prompt_completo

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
# Esta línea asegura que la API se configure al iniciar
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-3.5-flash')

def obtener_respuesta_gemini(pregunta_usuario: str):
    prompt = obtener_prompt_completo(pregunta_usuario)
    response = model.generate_content(prompt)
    return response.text
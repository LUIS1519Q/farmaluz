import os
from dotenv import load_dotenv
from google import genai
from .prompt_base import obtener_prompt_completo

# Cargar variables de entorno
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Inicializar el cliente con la nueva librería
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def obtener_respuesta_gemini(pregunta_usuario: str):
    # --- LISTAR MODELOS DISPONIBLES ---
    for m in client.models.list():
        print(f"MODELO DISPONIBLE: {m.name}")
    # ----------------------------------
    
    prompt = obtener_prompt_completo(pregunta_usuario)
    try:
        # Usamos la nueva sintaxis y el modelo recomendado
        response = client.models.generate_content(
            model='models/gemini-3.5-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error en Gemini API: {e}")
        return "Lo siento, en este momento estoy recibiendo muchas consultas. Por favor, intenta de nuevo en un momento."
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Cargamos el .env igual que en el servicio
load_dotenv(os.path.join(os.path.dirname(__file__), '../backend/.env'))

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("--- Modelos disponibles en tu cuenta ---")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"Nombre: {m.name}")
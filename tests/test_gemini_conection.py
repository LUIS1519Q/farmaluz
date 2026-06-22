import sys
import os

os.environ["GEMINI_API_KEY"] = ""
# Ajustamos la ruta para que 'backend' sea visible
ruta_backend = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
sys.path.insert(0, ruta_backend)


# Importación desde la nueva ubicación
from chatbot.gemini_service import obtener_respuesta_gemini

print("--- Iniciando Test de Integración del Día 3 ---")
try:
    # Llamada a la IA
    resultado = obtener_respuesta_gemini("¿Qué es FarmaLuz?")
    print("✅ ¡Test Exitoso! La IA respondió:")
    print(resultado)
except Exception as e:
    print(f"❌ El test falló. Error: {e}")
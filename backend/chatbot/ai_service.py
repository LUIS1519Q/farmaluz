import os
from langchain_groq import ChatGroq
# Importamos AIMessage para representar lo que dijo el bot antes
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

# Añadimos el historial como parámetro (por defecto vacío)
def get_ai_response(user_input, system_prompt, historial=[]):
    try:
        chat = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.1,
            model_name="llama-3.1-8b-instant"
        )
        
        # 1. El modelo siempre debe leer sus reglas primero
        messages = [SystemMessage(content=system_prompt)]
        
        # 2. Inyectamos la memoria (el historial)
        for msg in historial:
            # Ignoramos el saludo inicial para que la IA no se confunda
            if msg.contenido.startswith("¡Hola! Soy el asistente"):
                continue
                
            if msg.rol == 'usuario':
                messages.append(HumanMessage(content=msg.contenido))
            elif msg.rol == 'bot':
                messages.append(AIMessage(content=msg.contenido))
                
        # 3. Agregamos la nueva pregunta del usuario al final
        messages.append(HumanMessage(content=user_input))
        
        # 4. Enviamos todo el paquete a Groq
        response = chat.invoke(messages)
        return response.content
        
    except Exception as e:
        print(f"Error en Groq API: {e}")
        return "Lo siento, en este momento el servicio está recibiendo muchas consultas. Por favor, intenta de nuevo en un momento."
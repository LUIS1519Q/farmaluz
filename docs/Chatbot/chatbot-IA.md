Documentación Técnica: Módulo de IA y Chatbot FarmaLuz
1. Alcance del Sistema
El chatbot de FarmaLuz es un asistente virtual educativo especializado en el ámbito farmacéutico. Su función principal es orientar al usuario sobre medicamentos, dosis habituales y contraindicaciones, actuando bajo políticas de seguridad que prohíben el autodiagnóstico y la automedicación, garantizando un entorno de uso responsable.

2. Arquitectura del Sistema
El sistema emplea una arquitectura de microservicios con despliegue en AWS EC2 y gestión de proxy inverso con Nginx.

Frontend: Implementado con Next.js. Utiliza el componente react-markdown para el procesamiento y renderizado visual de respuestas estructuradas (negritas, viñetas y listas).

Backend: Desarrollado en FastAPI, actuando como orquestador entre el frontend y el modelo de lenguaje (LLM).

Gestión de IA: Integración con la API de Groq utilizando el modelo Llama-3.1-8b-instant, seleccionado por su baja latencia y alta estabilidad operativa en entornos concurrentes.

3. Lógica de Negocio y Resiliencia
El módulo fue diseñado bajo principios de ingeniería de software robusta:

Gestión de Estado (Memoria): A diferencia de modelos stateless, FarmaLuz implementa un sistema de gestión de historial. El frontend persiste el contexto de la conversación, el cual es inyectado por el backend como una lista de mensajes (HumanMessage/AIMessage) antes de cada inferencia, permitiendo mantener la coherencia contextual durante la interacción.

Resiliencia de Código: El endpoint POST /chatbot/consulta envuelve la llamada a la API de IA en un bloque try/except. Ante fallos de conectividad o saturación de la API de Groq, el sistema retorna una respuesta controlada y amigable, preservando la integridad de la sesión en el frontend (200 OK).

Ingeniería de Prompts: Se utiliza un System Prompt de alta fidelidad que impone:

Formato Estricto: Uso de Markdown para asegurar legibilidad visual.

Restricciones Éticas: Bloqueo explícito de diagnósticos clínicos y recomendaciones de tratamientos personalizados.

Aviso Legal: Inserción obligatoria de un disclaimer educativo al final de cada interacción.

4. Estructura de Módulos (Backend)
Plaintext
backend/
├── chatbot/
│   ├── ai_service.py     # Lógica de inferencia con Groq y manejo de historial
│   ├── __init__.py       # Definición de módulo para importación de paquetes
├── routers/
│   ├── chatbot.py        # Definición de endpoints y modelos Pydantic
└── main.py               # Entrada principal de la aplicación FastAPI
5. Estado de Pruebas y Validación
Entorno: Sistema validado en entorno de producción (AWS EC2).

Estabilidad: Tras la resolución de dependencias y la migración a modelos de inferencia soportados, el sistema presenta un índice de disponibilidad del 100% en pruebas de usuario (Frontend a Backend).

Integración: El flujo de datos entre el scraper de medicamentos y el chatbot permite que el sistema responda sobre principios activos con precisión, manteniendo la trazabilidad mediante los logs de auditoría en MongoDB Atlas.
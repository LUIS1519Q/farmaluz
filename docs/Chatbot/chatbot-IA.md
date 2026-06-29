Documentación Técnica: Módulo de IA y Chatbot FarmaLuz
1. Alcance del Módulo
El chatbot de FarmaLuz actúa como un asistente educativo especializado en farmacéutica. Su función principal es orientar al usuario sobre el uso de medicamentos, identificar alternativas genéricas de bajo costo y fomentar la transparencia en los precios de salud, bajo una estricta política de no diagnóstico médico.

2. Especificaciones Técnicas
Modelo: Google Gemini (gemini-3.5-flash).

Stack: Python, FastAPI, LangChain.

Integración: Conectado mediante SDK oficial de Google, utilizando una arquitectura de microservicios para el consumo de la API de IA.

Entorno de despliegue: AWS EC2 (instancia de producción).

3. Arquitectura de Prompts (Prompt Engineering)
Se implementó un System Instruction que define el comportamiento del modelo:

Rol: Asistente farmacéutico educativo.

Restricciones: * Limitación de longitud de respuesta (máximo 3 párrafos).

Prohibición absoluta de emitir diagnósticos o recomendaciones clínicas personalizadas.

Obligación de incluir un disclaimer legal en cada interacción sobre la necesidad de consultar a un médico.

4. Gestión de Infraestructura y Resiliencia (Manejo de Errores)
Para asegurar la estabilidad durante la demo frente a posibles saturaciones de la API (HTTP 503 UNAVAILABLE), se integró un mecanismo de resiliencia de código:

Implementación: Bloque try/except en la lógica de procesamiento del endpoint POST /chatbot/consulta.

Comportamiento ante fallo: El sistema captura excepciones de red/saturación de Google y retorna un mensaje de error elegante al frontend en lugar de colapsar la conexión.

Estado de Respuesta: El backend garantiza siempre un estado 200 OK al frontend, logrando que el usuario perciba una aplicación estable incluso si el proveedor de IA tiene demoras temporales.

5. Lógica de Negocio: Cálculo de Ahorro y Genéricos
La lógica para sugerir alternativas genéricas se basa en:

Cálculo: Ahorro % = ((Precio_Marca - Precio_Generico) / Precio_Marca) * 100.

Validación: Blindaje de datos mediante tests unitarios (Jest) para evitar valores negativos o divisiones por cero en caso de precios mal reportados por el scraper.

6. Estado Final de Pruebas
Integración: Flujo completo validado: Búsqueda -> Semáforo -> Alternativas -> Chatbot.

Estabilidad: El módulo ha sido verificado en el entorno de producción (AWS EC2) durante las pruebas de integración final (Sprint 4).
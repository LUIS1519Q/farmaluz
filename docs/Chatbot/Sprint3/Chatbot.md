Documentación del Chatbot - FarmaLuz
1. Arquitectura del Chatbot
El chatbot de FarmaLuz utiliza la API de Google Gemini (modelo gemini-1.5-flash) para procesar consultas de usuarios. Su arquitectura se basa en un Prompt de Sistema (System Instruction) que define su comportamiento como asistente experto en información farmacéutica.

Ruta del endpoint: POST /chatbot/consulta

Servicio central: backend/chatbot/gemini_service.py

Prompt base: backend/chatbot/prompt_base.py

2. Estructura de Genéricos
El chatbot interactúa con la colección genericos de MongoDB. Los documentos siguen este esquema:

Campo	Tipo	Descripción
id	Int	Identificador único del genérico
nombre	String	Nombre comercial o genérico
principio_activo	String	Principio activo para emparejamiento
precio_referencial	Float	Precio base para cálculo de ahorro
laboratorio	String	Fabricante del medicamento
3. Lógica de Ahorro
La funcionalidad de ahorro se integra en el endpoint de comparación. El chatbot invoca la lógica de:

Identificación: Obtiene el principio_activo del medicamento original consultado.

Comparación: Busca en la colección genericos todos los documentos que coincidan con dicho principio activo.

Cálculo: Ahorro = Precio Cobrado (Farmacia) - Precio Referencial (Genérico más barato).

Visualización: Se entrega un JSON ordenado ASCENDING por precio para sugerir la mejor opción al usuario.

4. Estado de Seguridad y Reglas (Blindaje)
Para garantizar la integridad y evitar el uso inadecuado (diagnósticos), se han implementado las siguientes reglas en el prompt_base.py:

Prohibición de Diagnósticos: El chatbot tiene prohibido recetar o sugerir fármacos ante síntomas. Ante cualquier mención de malestar físico, debe redirigir al usuario a un profesional de la salud.

Delimitación de Ámbito: El chatbot solo responde consultas relacionadas con medicamentos, precios y consultas de salud informativa.

Manejo de Temas Irrelevantes: Se ha configurado una regla de rechazo para preguntas fuera del ámbito farmacéutico (ej. política, cultura general), respondiendo cortésmente que solo puede asistir en temas de FarmaLuz.
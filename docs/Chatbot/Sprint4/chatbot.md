# Documentación del Módulo de Inteligencia Artificial: Chatbot FarmaLuz

## 1. Descripción General
El Asistente IA de FarmaLuz es un módulo interactivo diseñado para proveer información estrictamente educativa sobre medicamentos, principios activos y salud general en el contexto ecuatoriano. Su arquitectura garantiza que la Inteligencia Artificial opere bajo límites de seguridad estrictos, previniendo el autodiagnóstico y la automedicación, y derivando al usuario a un profesional de la salud cuando es necesario.

## 2. Stack Tecnológico
* **Frontend:** React, Next.js, TypeScript, Tailwind CSS.
* **Modelo LLM:** Gemini (Google) / Integración mediante API.
* **Backend:** Interfaz de conexión en Python para el enrutamiento de consultas y manejo del historial de chat.

## 3. Arquitectura del Sistema Prompt
El comportamiento del LLM está controlado por un `SYSTEM_PROMPT` con directivas inmutables:
1. **Restricción de Diagnóstico:** Prohibición absoluta de diagnosticar enfermedades o recetar tratamientos basados en síntomas.
2. **Formato Obligatorio:** Uso estructurado de Markdown (negritas para conceptos clave, listas para enumeraciones y párrafos cortos).
3. **Sección de Sugerencias:** Obligación de generar 3 preguntas dinámicas de seguimiento ("Preguntas sugeridas") al final de cada intervención.
4. **Despedida Amable:** Excepción de formato ante la intención de cierre de conversación ("No necesito nada más").

## 4. Lógica de Procesamiento en el Frontend (Parseo Dinámico)
El componente del cliente (`Chatbot.tsx`) no renderiza texto plano, sino que actúa como un middleware de formateo para garantizar una UI limpia:

* **Extractor de Avisos Legales:** Mediante expresiones regulares (`Regex`), el sistema intercepta el texto legal generado por la IA (ej. `[AVISO LEGAL: ...]`), lo elimina del flujo de texto principal y lo renderiza en un componente visual independiente (`<div className="text-gray-500">`) para darle peso legal.
* **Traductor de Markdown a HTML:** Se implementó una función transformadora `formatearTexto` que detecta sintaxis Markdown (`**`, `*`, `+`, `-`) y la inyecta dinámicamente en etiquetas HTML (como `<strong>` y contenedores flexbox con viñetas) evadiendo la necesidad de librerías externas pesadas.
* **Auto-formato de Títulos:** Detección de caracteres delimitadores (`:`) en listas para forzar la negrita en subtítulos de manera automática, mitigando errores de formato del LLM.

## 5. Sistema de Sugerencias y Programación Defensiva
Para reducir la fricción en la experiencia de usuario (UX) y mantener la conversación guiada, el chatbot implementa botones de acción rápida:

1. **Prompt Starters:** Tarjetas iniciales (ej. "Genéricos vs. Marca") que se renderizan exclusivamente cuando el historial de mensajes (`mensajes.length`) es igual a 1.
2. **Sugerencias Dinámicas:** Extracción mediante `Regex` de las preguntas generadas por el LLM para convertirlas en botones interactivos iterativos.
3. **Mecanismo de Fallback (Salvavidas):** Implementación de programación defensiva. Si el LLM alucina, omite el formato o falla en enviar las sugerencias, el frontend detecta el array vacío e inyecta 3 sugerencias por defecto ("¿Cuáles son los efectos secundarios?", "¿Cuál es la dosis recomendada?", "¿Existen contraindicaciones?"), garantizando que la UI nunca se rompa.

## 6. Flujo de Cierre de Conversación
Se implementó un botón estático de cierre ("No necesito nada más, gracias") que se habilita a partir de la segunda iteración de respuesta (`index >= 2`). Al activarse:
* Se envía la intención de cierre al LLM.
* Se ocultan dinámicamente los contenedores de sugerencias (`esConversacionTerminada = true`).
* El LLM responde aplicando la "Excepción de Despedida" configurada en el backend, cerrando el flujo sin inyectar formatos clínicos ni avisos legales redundantes.

## 7. Criterios de Éxito de la Integración
* Las respuestas son inmediatas y el `scrollIntoView` mantiene el foco en el último mensaje.
* El LLM rechaza el 100% de las consultas de autodiagnóstico en pruebas de integración.
* La interfaz maneja asincronía y fallos de red de la API mostrando un estado de escritura (`setEscribiendo(true)`) y alertas de desconexión.
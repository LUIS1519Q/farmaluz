Sprint 2 — Documentación de Avance
Responsable: Vela Vanessa – IA + Chatbot
Fecha: 23 - 25 de junio 2026

Día 1 — 23 de junio 2026
Qué se hizo
Modelado de Datos: Definición y creación de la colección genericos en MongoDB con la estructura: medicamento_id, nombre_generico, principio_activo, precio_referencial y laboratorio.
![alt text](image.png)

Endpoints Real: Migración de datos mock a datos reales persistentes en la base de datos.

Implementación de GET /genericos/{medicamento_id} consultando directamente a la colección.
![alt text](image-4.png)

Implementación de POST /genericos para la gestión administrativa de equivalentes.
![alt text](image-5.png)

Carga de Datos: Inicialización de la base de datos con 10 genéricos reales vinculados a los medicamentos principales.


Día 2 — 24 de junio 2026
Qué se hizo
Lógica de Optimización: Implementación del algoritmo de ordenamiento ASCENDING por precio_referencial en las consultas de genéricos.

Cálculo de Valor: Desarrollo de la lógica de ahorro estimado:

Ahorro = Precio_Original - Precio_Genérico_Más_Barato.
![alt text](image-3.png)

Respuesta de API: Actualización de la respuesta del endpoint para incluir la lista de alternativas sugeridas junto con el monto de ahorro calculado para el usuario.
![alt text](image-6.png)

Validación: Pruebas de integración exitosas mediante el entorno /docs (FastAPI).

Día 3 — 25 de junio 2026
Qué se hizo
Auditoría de IA: Revisión del prompt_base.py para asegurar cumplimiento estricto con las políticas de seguridad del Sprint 0.

Pruebas de Estrés: Ejecución de escenarios críticos (preguntas ambiguas, intentos de diagnóstico, consultas fuera de ámbito) para validar la robustez del modelo.
![alt text](image-1.png)
![alt text](image-2.png)

Ajuste Fino: Reforzamiento de las instrucciones del sistema para garantizar la negativa total ante consultas de diagnóstico médico.

Documentación Técnica: Creación de /docs/chatbot.md detallando la estructura de datos, la lógica de negocio aplicada y el estado de seguridad del chatbot.
https://huly.app/workbench/farmaluz/document/documentacion-del-chatbot-farmaluz-6a406249afbcbe8eeeacd8f6

Comunicación: Notificación al equipo de Frontend (Chicaiza) sobre la disponibilidad y estabilidad del nuevo endpoint de genéricos.

Entregables completados
✅ Colección genericos operativa con 10 registros reales.

✅ Endpoint GET /genericos/{id} con ordenamiento por precio y cálculo de ahorro incluido.

✅ Endpoint POST /genericos habilitado.

✅ Chatbot validado mediante pruebas de robustez; blindaje ético confirmado.

✅ Documentación técnica actualizada en /docs/chatbot.md.
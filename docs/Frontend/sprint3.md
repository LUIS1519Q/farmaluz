Sprint 3 — Documentación de Avance

Responsable: Alex Chicaiza – Frontend
Día 1 — 26 de junio 2026

Qué se hizoConstrucción de la pantalla de Sugerencia de Genéricos (genericos/[id]/page.tsx) siguiendo el wireframe de Figma.  
Conexión de la vista al endpoint GET /genericos/{id} y a la API de comparación.  
Lógica implementada para calcular matemáticamente la diferencia de precios y mostrar visualmente el ahorro estimado.  
Construcción de la interfaz de chat en chatbot/page.tsx, incluyendo diseño de burbujas, campo de texto deshabilitable y botón de envío.  
Conexión exitosa del frontend con el endpoint POST /chatbot/consulta.  
Implementación de animación de carga (estado "escribiendo...") para mejorar la UX mientras se espera la respuesta de Gemini.  

Decisión técnica

Se implementó un diseño de código altamente defensivo con bloques try/catch para la gestión de errores HTTP 404. Si el backend (scraper) aún no registra datos de un genérico o si el endpoint de IA de Gemini presenta fallos de red local, el Frontend no genera una pantalla de error crítica ("pantalla roja de Next.js"), sino que atrapa el fallo y renderiza vistas amigables de contingencia para mantener al usuario dentro del flujo. Asimismo, se ajustaron las peticiones de Axios forzando el trailing slash (/) para evitar bloqueos de CORS generados por redirecciones 307 Temporary Redirect del servidor FastAPI en AWS.

Entregables completados

✅ Pantalla de genéricos conectada mostrando ahorro
estimado. 
✅ Pantalla de chatbot conectada y funcional   

Día 2 — 27 de junio 2026

Qué se hizo

Agregados los botones de redirección en la pantalla de detalle/semáforo hacia las nuevas pantallas, logrando una navegación fluida (Inicio → Resultados → Detalle/Semáforo → Genéricos / Chatbot).  
Inclusión del aviso legal permanente en la cabecera del Asistente IA ("Esta información es educativa y no reemplaza la consulta médica").  Revisión general del diseño responsive, asegurando la legibilidad del chat y los genéricos tanto en vista móvil como de escritorio.  
Confirmación enviada a Males (QA) notificando que el entorno está estable para la ejecución de pruebas Cypress End-to-End.  
Código subido al repositorio en la rama feature/sprint3.  

Entregables completados

✅ Navegación completa entre las 5 pantallas del sistema 
✅ Aviso legal del chatbot visible 
✅ Responsive verificado en el flujo completo   

Evidencia — Día 1
![Pantalla Genericos](../capturas/frontend/sprint2/dia1_implementando_axios.png)
![Chat Bot](../capturas/frontend/sprint2/dia1_interfaz_chatbot.png)
![Chat Bot](../capturas/frontend/sprint2/dia1_chatbot_escribiendo.png)

Evidencia — Día 2
![Botones Navegacion](../capturas/frontend/sprint2/dia2_botones_navegacion.png)
![Botones Navegacion](../capturas/frontend/sprint2/dia2_responsive_flujo.png)


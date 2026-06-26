Sprint 2 — Documentación de Avance (Frontend)

**Responsable:** Alex Chicaiza
**Días:** 1 y 2 (23 y 24 de junio)

Qué se hizo

**Día 1: Preparación y Conexión Base**
- Se creó el archivo `lib/api.ts` implementando la instancia de Axios para centralizar las peticiones a la API real.
- La pantalla de resultados (`resultados/page.tsx`) fue refactorizada para consumir el endpoint `GET /medicamentos` en lugar del JSON local.

Entregables Completados

✅ Frontend consumiendo GET /medicamentos real (sin mocks)

**Día 2: Semáforo y Manejo de Estados**
- Se conectó la vista de detalle y el componente `SemaforoCard.tsx` para consumir el endpoint `GET /comparacion/{id}`.
- Se implementaron vistas de estado (`loading`) para mejorar la UX mientras FastAPI responde.
- Se programó una pantalla de error amigable para evitar que la aplicación colapse ante caídas del servidor.
- Se agregó el renderizado condicional del campo `ultima_actualizacion` para informar la vigencia del precio.

Decisiones Técnicas Tomadas
1. **Fallback de Contingencia:** Se implementó un bloque `try/catch` que carga los mocks locales si el servidor EC2 de backend o la base de datos de MongoDB Atlas fallan.
2. **Normalización de Datos:** Se crearon funciones de limpieza (`limpiarPrecio`) y extracción segura de variables (ej. leer `med.nombre` o `med["Principio Activo"]`) para evitar errores de renderizado (`undefined`) en caso de que el backend cambie las llaves del JSON o envíe strings con símbolos de moneda.

Entregables Completados

✅ SemaforoCard mostrando datos reales del backend
✅ Manejo de estados de carga y error

**Día 3: Pulir Experiencia de Búsqueda Real y Cierre** 25 de Junio de 2026
- Se probó la experiencia de búsqueda utilizando los datos reales importados del CSV con nombres reales de medicamentos ecuatorianos del catálogo oficial.
- Se ajustó el diseño de la interfaz y las tarjetas para garantizar que los textos reales (más largos o cortos que los mocks antiguos) se visualicen correctamente sin generar desbordamientos.
- Se verificó la adaptabilidad del diseño (responsive) en dispositivos móviles y de escritorio utilizando la información dinámica de producción.
- Se reestructuró la vista de detalle para consumir los endpoints de forma aislada y unificar los datos del catálogo con los cálculos de sobreprecio de manera segura.
- Se notificó formalmente al responsable de QA (Mateo Males) que el flujo completo (buscar → ver semáforo) está listo para el diseño de pruebas automatizadas con Cypress en el Sprint 3.

Decisiones Técnicas Tomadas
3. **Aislamiento de Peticiones y Control de Excepciones:** Se separaron las llamadas de red en la vista de detalle empleando bloques `try/catch` independientes. Esto evita que un error `404 Not Found` (cuando el scraper aún no procesa un precio) interrumpa el flujo del cliente o genere excepciones críticas en el servidor de desarrollo de Next.js, transformándolo en un mensaje controlado y amigable para el usuario.

Entregables Completados

✅ Interfaz adaptada a nombres reales del catálogo CSV sin desbordamientos de diseño
✅ Flujo completo de búsqueda y detalle verificado en entornos responsive (móvil/desktop)
✅ Control de excepciones robusto para paths vacíos y respuestas del servidor
✅ Notificación y entrega formal del flujo End-to-End al área de QA


Evidencia — Día 1

![Estructura](../capturas/frontend/sprint2/dia1_implementando_axios.png)

Evidencia — Día 2

![Resultados API Real](../capturas/frontend/sprint2/dia2_resultados_api.png)
![Detalle API Real](../capturas/frontend/sprint2/dia2_detalle_api.png)

Evidencia — Día 3

![Búsqueda Real y Responsive](../capturas/frontend/sprint2/dia3_busqueda_real_responsive.png)
![Detalle Completo Dinámico](../capturas/frontend/sprint2/dia3_detalle_completo_dinamico.png)
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


Evidencia — Día 1

![Estructura](../capturas/frontend/sprint2/dia1_implementando_axios.png)

Evidencia — Día 2

![Resultados API Real](../capturas/frontend/sprint2/dia2_resultados_api.png)
![Detalle API Real](../capturas/frontend/sprint2/dia2_detalle_api.png)
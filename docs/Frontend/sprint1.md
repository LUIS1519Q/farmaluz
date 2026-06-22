Sprint 1 — Documentación de Avance

Responsable: Alex Chicaiza – Frontend
Día 1 — 20 de junio 2026

Qué se hizo

- Proyecto Next.js creado en local (frontend/) usando App Router
- Dependencias instaladas: axios, lucide-react
- Paleta de colores configurada en globals.css
- Estructura de carpetas base creada para rutas (page.tsx, resultados, medicamento, chatbot) y components/
- Todo pusheado a feature/sprint0

Decisión técnica

Se utilizó la nueva directiva @theme en globals.css en lugar del tradicional tailwind.config.js para inyectar la paleta de colores corporativa. Esto permite mantener compatibilidad total con la versión 4 de Tailwind CSS, la cual viene por defecto en la última instalación de Next.js.

Entregables completados

✅ Proyecto Next.js configurado con Tailwind y colores
✅ Estructura de carpetas base creadas

Día 2 — 21 de junio 2026

Qué se hizo

- Archivo de datos simulados creado en data/mockMedicamentos.json con 8 medicamentos y cálculos de sobreprecio
- Componente Navbar.tsx creado con navegación básica y logo
- Componente SearchBar.tsx creado y centrado
- Componente SemaforoCard.tsx creado con renderizado condicional (Verde/Rojo) e íconos de Lucide
- Pantalla de Inicio/Buscador construida y adaptada al wireframe
- Pantalla de Resultados construida iterando los datos mock dinámicamente

Entregables completados

✅ Pantalla de Inicio/Buscador funcional
✅ Pantalla de Resultados con cards de medicamentos (datos mock)
✅ Componente SemaforoCard funcionando visualmente (VERDE/ROJO)

Evidencia — Día 1

![Creación del proyecto Next.js](../capturas/frontend/sprint1/dia1_creacion_nextjs.png)
![Estructura de carpetas](../capturas/frontend/sprint1/dia1_estructura_carpetas.png)

Evidencia — Día 2

![Archivo Mock JSON](../capturas/frontend/sprint1/dia2_mock_json.png)
![Pantalla del Buscador](../capturas/frontend/sprint1/dia2_pantalla_buscador.png)
![Pantalla de Resultados](../capturas/frontend/sprint1/dia2_pantalla_resultados.png)
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

Día 3 — 22 de junio 2026

Qué se hizo

- Componente SearchBar.tsx actualizado para capturar el input y redirigir con parámetros de URL (?q=).
- Pantalla de Resultados (resultados/page.tsx) actualizada para procesar parámetros de búsqueda y filtrar dinámicamente el JSON simulado.
- Tarjetas de resultados envueltas en el componente Link de Next.js para permitir navegación dinámica.
- Pantalla de detalle de medicamento (medicamento/[id]/page.tsx) construida, mostrando datos específicos y reutilizando el componente SemaforoCard.
- Responsividad verificada en dispositivos móviles y de escritorio.
- Flujo End-to-End visual validado. Todo pusheado a feature/sprint0.

Entregables completados

✅ Pantalla de detalle de medicamento
✅ Buscador funcional con filtros por URL
✅ Responsive verificado en móvil y desktop

Evidencia — Día 1

![Creación del proyecto Next.js](../capturas/frontend/sprint1/dia1_creacion_nextjs.png)
![Estructura de carpetas](../capturas/frontend/sprint1/dia1_estructura_carpetas.png)

Evidencia — Día 2

![Archivo Mock JSON](../capturas/frontend/sprint1/dia2_mock_json.png)
![Pantalla del Buscador](../capturas/frontend/sprint1/dia2_pantalla_buscador.png)
![Pantalla de Resultados](../capturas/frontend/sprint1/dia2_pantalla_resultados.png)

Evidencia — Día 3
![Pantalla de Busqueda Filtrada](../capturas/frontend/sprint1/dia3_busqueda_filtrada.png)
![Pantalla Detalle Medicamento](../capturas/frontend/sprint1/dia3_detalle_medicamento.png)
![Pantalla Responsive](../capturas/frontend/sprint1/dia3_pantalla_responsive.png)
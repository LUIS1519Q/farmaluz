Sprint 4 — Documentación de Avance (Entrega Final)
Responsable: Alex Chicaiza – Frontend

Día 1 — 28 de junio 2026

Qué se hizo

Ejecución de pulido visual en las 5 pantallas del sistema. Se corrigieron alineaciones de texto e íconos en el componente SemaforoCard (implementando flex-col para evitar desbordamientos) y se ajustaron los bloqueos de estado activo en los enlaces del Navbar.

Construcción de la nueva pantalla "Acerca de" (acerca/page.tsx), integrando la identidad visual del proyecto y detallando el propósito social de FarmaLuz, junto con los créditos al equipo S6-P1 de la Universidad Central del Ecuador (UCE).

Pruebas exhaustivas de QA en dispositivos móviles físicos mediante red local (192.168.x.x). Se identificaron y corrigieron bugs críticos de diseño responsivo.

Creación de menú de hamburguesa flotante para la navegación móvil.

Redacción del Manual_Usuario_FarmaLuz.docx estructurado con el flujo completo de la aplicación (búsqueda → semáforo → genéricos → chatbot) utilizando capturas de pantalla reales del entorno local.

Decisión técnica

Durante las pruebas en dispositivos móviles físicos, se detectó que los navegadores móviles forzaban el comportamiento nativo de HTML en la barra de búsqueda (recargando la página y añadiendo un ? a la URL) e ignoraban la hidratación del enrutador de Next.js (router.push). Para garantizar la estabilidad de la aplicación en cualquier dispositivo durante la demostración, se optó por eliminar la etiqueta <form> tradicional y forzar la redirección mediante window.location.href. Adicionalmente, el menú móvil se extrajo del flujo del DOM utilizando una posición fixed con un z-index máximo para evitar superposiciones de capas con los componentes inferiores.
Se añadió un menú hamburguesa para las vistas móviles.

Entregables completados

✅ Pulido visual aplicado consistentemente en las 5 pantallas

✅ Diseño responsivo verificado y depurado en dispositivos móviles físicos

✅ Manual_Usuario_FarmaLuz.docx con capturas reales del sistema finalizado

Día 2 — 29 de junio 2026

Qué se hizo

Exportación del manual de usuario a formato PDF para la entrega formal de la documentación.

Despliegue del Frontend configurando correctamente las variables de entorno (GEMINI_API_KEY y la IP del backend en EC2) para garantizar el acceso público durante la demostración.

Participación conjunta en el ensayo general de la demo técnica validando el flujo E2E (End-to-End) completo sin interrupciones.

Confirmación de código final y subida al repositorio para su posterior integración a la rama main.

Entregables completados

✅ Manual_Usuario_FarmaLuz.pdf exportado y adjuntado en la carpeta /docs

✅ Frontend desplegado y accesible públicamente para la presentación al ingeniero

✅ Código final empaquetado y enviado a la rama feature/sprint4

Evidencia — Día 1

![Pantalla busqueda](../capturas/frontend/sprint4/dia1_pantalla_busqueda.png)
![Pantalla chatbot](../capturas/frontend/sprint4/dia1_pantalla_chatbot.png)
![Pantalla detalle](../capturas/frontend/sprint4/dia1_pantalla_detalle.png)
![Pantalla principal](../capturas/frontend/sprint4/dia1_pantalla_principal.png)

Evidencia — Día 2
![Manual usuario](../capturas/frontend/sprint4/dia2_manual_usuario.png)
# Informe de Sprint 4

## Información General

- **Proyecto:** FarmaLuz
- **Sprint:** 4
- **Responsable:** Alex Velarde
- **Duración:** 28 al 29 de junio de 2026

---

# Objetivo del Sprint

Optimizar el rendimiento de los scrapers, mejorar la precisión en la identificación de medicamentos y preparar el sistema para su ejecución automática en un entorno de producción.

---

# Actividades desarrolladas

## Optimización del scraper

Se realizaron múltiples mejoras orientadas a reducir el tiempo de procesamiento de los medicamentos.

Entre ellas:

- Reutilización de páginas de Playwright.
- Optimización de consultas.
- Reducción de cargas innecesarias.
- Organización del proceso mediante un ejecutor central (`run_all.py`).

---

## Mejora del proceso de identificación

Se amplió la información utilizada para identificar medicamentos.

Ahora el sistema analiza información obtenida desde distintas secciones de cada farmacia, incluyendo:

- Beneficios y uso.
- Ficha técnica.
- Descripción.
- Aviso legal.
- Ingredientes.
- Información adicional disponible.

Toda esta información es enviada al ParserService para mejorar la precisión del proceso de comparación.

---

## Validación de concentraciones

Se fortaleció el proceso de validación para evitar asociaciones incorrectas entre medicamentos con diferentes concentraciones.

Se implementó la normalización de unidades antes de realizar las comparaciones.

---

## Mejoras en el almacenamiento

Se optimizó la estructura de almacenamiento de la colección de precios en MongoDB.

Además del precio obtenido desde la farmacia, ahora se almacena información complementaria como:

- Precio techo del MSP.
- Fecha de actualización.
- URL del medicamento.

---

## Preparación para producción

Se realizaron ajustes para facilitar la futura ejecución automática mediante Cron Job y mejorar la estabilidad general del sistema.

También se implementaron mecanismos de depuración y registro de eventos para facilitar el mantenimiento del scraper.

---

# Resultados obtenidos

- Mayor precisión en la identificación de medicamentos.
- Validación robusta de concentraciones.
- Optimización del rendimiento.
- Mejor estructura de almacenamiento en MongoDB.
- Sistema preparado para automatización.

---

# Dificultades encontradas

El principal reto consistió en la gran variabilidad existente entre las fichas de medicamentos publicadas por las farmacias, ya que muchas utilizan estructuras HTML diferentes y distribuyen la información técnica en distintas secciones.

Fue necesario adaptar el scraper para recopilar la mayor cantidad posible de información antes de realizar el proceso de comparación.

---

# Conclusiones

Al finalizar el Sprint 4 el sistema alcanzó un mayor nivel de madurez, incorporando mecanismos de validación más robustos, mejoras de rendimiento y una estructura preparada para futuras ejecuciones automáticas y despliegues en producción.
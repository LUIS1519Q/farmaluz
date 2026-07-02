# Informe de Sprint 2

## Información General

- **Proyecto:** FarmaLuz
- **Sprint:** 2
- **Responsable:** Alex Velarde
- **Duración:** 23 al 25 de junio de 2026

---

# Objetivo del Sprint

Desarrollar los primeros scrapers funcionales para obtener información de medicamentos desde las farmacias Fybeca y Cruz Azul, integrándolos con la base de datos MongoDB Atlas para almacenar los precios obtenidos automáticamente.

---

# Actividades desarrolladas

## Desarrollo del scraper para Fybeca

Durante este sprint se implementó el scraper de Fybeca utilizando Playwright. Se desarrolló la lógica necesaria para:

- Automatizar la búsqueda de medicamentos.
- Navegar por los resultados obtenidos.
- Acceder a la ficha individual de cada medicamento.
- Extraer información relevante como:
  - Nombre comercial.
  - Precio.
  - URL del producto.
  - Información técnica disponible.

Se realizaron pruebas con diferentes medicamentos para validar el correcto funcionamiento del scraper.

---

## Desarrollo del scraper para Cruz Azul

Posteriormente se implementó un segundo scraper para la farmacia Cruz Azul siguiendo una arquitectura similar a la utilizada en Fybeca.

Se desarrolló la extracción automática de:

- Nombre del medicamento.
- Precio.
- Información disponible en la ficha del producto.
- URL del medicamento.

Se adaptó la lógica a la estructura HTML específica de esta farmacia.

---

## Integración con MongoDB Atlas

Se configuró la conexión con MongoDB Atlas para almacenar automáticamente la información obtenida por ambos scrapers.

Se implementó la persistencia de los registros en la colección de precios utilizando los servicios del backend del proyecto.

---

## Automatización del proceso

Se creó el archivo principal `run_all.py`, encargado de ejecutar secuencialmente ambos scrapers.

Esta estructura permitirá posteriormente automatizar el proceso mediante tareas programadas (Cron Job).

---

# Resultados obtenidos

- Scraper funcional para Fybeca.
- Scraper funcional para Cruz Azul.
- Integración con MongoDB Atlas.
- Almacenamiento automático de precios.
- Estructura preparada para automatización.

---

# Dificultades encontradas

Durante el desarrollo se identificaron diferencias importantes entre la estructura HTML utilizada por cada farmacia, por lo que fue necesario adaptar el proceso de extracción para cada sitio web.

También fue necesario validar diferentes selectores HTML para garantizar una extracción confiable de la información.

---

# Conclusiones

Al finalizar el Sprint 2 se obtuvo una primera versión completamente funcional del sistema de scraping, permitiendo automatizar la obtención de precios desde dos farmacias nacionales e integrarlos con la base de datos del proyecto.
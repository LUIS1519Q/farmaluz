# Informe de Sprint 3

## Información General

- **Proyecto:** FarmaLuz
- **Sprint:** 3
- **Responsable:** Alex Velarde
- **Duración:** 26 al 27 de junio de 2026

---

# Objetivo del Sprint

Incrementar la precisión de los scrapers mediante la validación de medicamentos, mejorar el procesamiento de la información obtenida y garantizar la consistencia de los datos almacenados en MongoDB.

---

# Actividades desarrolladas

## Validación de medicamentos

Se implementaron mecanismos de comparación entre los medicamentos obtenidos desde las farmacias y la base oficial del Ministerio de Salud Pública.

Para ello se desarrolló un proceso de validación considerando:

- Principio activo.
- Concentración.
- Presentación farmacéutica.

---

## Desarrollo del ParserService

Se implementó un servicio encargado de interpretar automáticamente la información textual obtenida desde las farmacias.

Este componente permite identificar:

- Principio activo.
- Concentraciones.
- Presentación farmacéutica.
- Múltiples principios activos cuando existen medicamentos combinados.

---

## Desarrollo del ComparadorService

Se desarrolló un sistema de puntuación (Score) que determina el nivel de coincidencia entre un medicamento del MSP y un producto encontrado en la farmacia.

Este proceso permite seleccionar automáticamente el medicamento con mayor similitud.

---

## Normalización de información

Se realizaron múltiples ajustes para normalizar la información obtenida desde ambas farmacias, considerando diferencias en:

- Formato de concentraciones.
- Presentaciones farmacéuticas.
- Nombres comerciales.
- Información técnica.

---

## Validación del almacenamiento

Se verificó el almacenamiento correcto de los precios en MongoDB, incluyendo la fecha de actualización de cada registro.

---

# Resultados obtenidos

- Parser automático de medicamentos.
- Comparador basado en Score.
- Validación de principios activos.
- Validación de concentraciones.
- Mejora significativa en la precisión de las coincidencias.
- Información almacenada de forma consistente.

---

# Dificultades encontradas

Las farmacias presentan estructuras HTML diferentes y utilizan distintos formatos para describir un mismo medicamento.

Fue necesario desarrollar un proceso de normalización que permitiera comparar correctamente la información obtenida.

---

# Conclusiones

Al finalizar el Sprint 3 el sistema dejó de limitarse a extraer precios y pasó a identificar automáticamente el medicamento correcto, incrementando considerablemente la calidad de los datos almacenados.
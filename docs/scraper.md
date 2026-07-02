# Limitaciones del Sistema

## Proyecto

**FarmaLuz**

---

# Introducción

Durante el desarrollo del sistema de comparación automática de precios de medicamentos se identificaron diversas limitaciones relacionadas principalmente con la forma en que las farmacias publican la información de sus productos en sus sitios web.

Estas limitaciones no corresponden a errores del sistema desarrollado, sino a diferencias en la estructura, organización y calidad de la información disponible en cada portal web.

---

# Limitaciones identificadas

## 1. Estructura HTML diferente entre farmacias

Cada farmacia utiliza una estructura HTML distinta para mostrar la información de sus productos.

No existe un estándar común para presentar datos como:

- Nombre del medicamento.
- Principio activo.
- Concentración.
- Presentación farmacéutica.
- Laboratorio.
- Precio.

Esto obliga a desarrollar un scraper específico para cada farmacia y aumenta el esfuerzo de mantenimiento cuando los sitios web realizan cambios en su diseño.

---

## 2. Información distribuida en distintas secciones

La información técnica de un medicamento no siempre se encuentra en un único lugar.

Dependiendo del producto, los datos pueden aparecer en diferentes apartados como:

- Ficha técnica.
- Beneficios y uso.
- Descripción.
- Aviso legal.
- Ingredientes.
- Información adicional.

Incluso existen medicamentos donde parte de la información se encuentra únicamente en texto libre, dificultando su identificación automática.

---

## 3. Falta de uniformidad en la descripción de medicamentos

Los medicamentos no siguen un formato uniforme de publicación.

Por ejemplo, algunos productos indican:

- Principio activo.
- Concentración.
- Presentación.

Mientras que otros únicamente muestran el nombre comercial.

Esto dificulta el proceso de identificación y comparación con la base oficial del Ministerio de Salud Pública.

---

## 4. Inconsistencia en las concentraciones

Las concentraciones pueden representarse utilizando distintos formatos.

Ejemplos:

- 400MG
- 400 MG
- 400 Mg
- 0.4 g
- 400 mg/ml

Estas diferencias requieren procesos adicionales de normalización antes de realizar las comparaciones.

---

## 5. Información incompleta sobre el contenido del empaque

Una limitación importante encontrada es que algunas farmacias no indican claramente la cantidad de unidades contenidas en cada presentación.

Por ejemplo, en ciertos productos no se especifica si el precio corresponde a:

- Caja de 10 tabletas.
- Caja de 30 tabletas.
- Blíster.
- Frasco.
- Unidad individual.

Esta situación dificulta el cálculo automático del precio unitario y puede afectar la comparación con el precio techo publicado por el Ministerio de Salud Pública, el cual generalmente corresponde al valor por unidad farmacéutica.

---

## 6. Diferencias entre nombres comerciales y principios activos

Frecuentemente las farmacias muestran únicamente el nombre comercial del medicamento y omiten el principio activo.

En otros casos ocurre lo contrario.

Esto obliga al sistema a analizar múltiples fuentes de información antes de determinar la correspondencia con el medicamento registrado por el MSP.

---

## 7. Cambios constantes en los sitios web

Las farmacias actualizan periódicamente el diseño de sus páginas web.

Estos cambios pueden modificar:

- Selectores HTML.
- Estructura de las fichas.
- Ubicación de los precios.
- Ubicación de la información técnica.

Como consecuencia, los scrapers requieren mantenimiento continuo para adaptarse a estos cambios.

---

## 8. Disponibilidad de medicamentos

No todos los medicamentos registrados por el Ministerio de Salud Pública se encuentran disponibles en las farmacias consultadas.

En estos casos el sistema no puede obtener un precio de referencia, ya que el producto simplemente no existe en el catálogo de la farmacia al momento de realizar la consulta.

---

## 9. Variaciones en la actualización de precios

Los precios publicados por las farmacias pueden cambiar en cualquier momento.

Aunque el sistema realiza actualizaciones periódicas mediante procesos automatizados, siempre existe la posibilidad de que un precio cambie entre una ejecución del scraper y la siguiente.

---

# Conclusión

Las principales limitaciones del sistema provienen de la falta de estandarización en la información publicada por las farmacias, tanto en la estructura de sus sitios web como en la forma de registrar los medicamentos.

A pesar de estas restricciones, el sistema implementa mecanismos de extracción, normalización y validación que permiten obtener información confiable y automatizar el proceso de comparación de precios con un alto nivel de precisión.
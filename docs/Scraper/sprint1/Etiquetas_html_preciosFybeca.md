# Selectores HTML utilizados para obtener precios en Fybeca

## Objetivo

Documentar los selectores HTML identificados en el sitio web de Fybeca para extraer precios de medicamentos mediante scraping.

> **Importante:** Estos selectores fueron obtenidos mediante inspección manual con las herramientas de desarrollo del navegador (DevTools). Si Fybeca modifica la estructura de su sitio, deberán revisarse y actualizarse.

---

# 1. Precio en el listado de medicamentos

Cuando se realiza una búsqueda o se navega por una categoría, cada producto contiene un bloque HTML similar al siguiente:

```html
<div class="price">
    <span class="list d-block">
        <span class="value" content="1.40">
            <span class="price-original">
                <span class="sales">
                    <div class="large-price w-100 d-flex mb-1">
                        <span class="value">
                            $1.40
                        </span>
                    </div>
                </span>
            </span>
        </span>
    </span>
</div>
```

## Selector principal

```css
.price .list .value
```

### Descripción

Permite acceder al elemento que contiene el precio dentro del atributo `content`.

### Ejemplo

```html
<span class="value" content="1.40">
```

### Valor obtenido

```text
1.40
```

---

## Selector alternativo (texto visible)

```css
.price .price-original .value
```

### Descripción

Obtiene el precio mostrado visualmente al usuario.

### Ejemplo

```html
<span class="value">
    $1.40
</span>
```

### Valor obtenido

```text
$1.40
```

---

# 2. Precio en la página individual del medicamento

Cuando se abre la página de un medicamento específico, la estructura observada es:

```html
<div class="prices">
    <div class="price">

        <span class="sales d-flex flex-wrap mb-1 align-items-center">
            <div class="large-price d-flex">
                <span class="value" content="3.22">
                    $3.22
                </span>
            </div>
        </span>

        <span class="list d-block">
            <span class="value" content="3.59">
            </span>
        </span>

    </div>
</div>
```

## Precio actual

### Selector

```css
.prices .price .large-price .value
```

### Descripción

Obtiene el precio actual del medicamento.

### Ejemplo

```html
<span class="value" content="3.22">
    $3.22
</span>
```

### Valores disponibles

| Fuente | Valor |
|----------|----------|
| Atributo `content` | 3.22 |
| Texto visible | $3.22 |

---

## Precio de lista

### Selector

```css
.prices .price .list .value
```

### Descripción

Obtiene el precio de lista o precio anterior del producto.

### Ejemplo

```html
<span class="value" content="3.59">
</span>
```

### Valor obtenido

```text
3.59
```

---

# Recomendación para el scraper

Se recomienda utilizar siempre el atributo `content` cuando esté disponible:

```html
<span class="value" content="3.22">
```

en lugar del texto visible:

```html
<span class="value">
    $3.22
</span>
```

## Ventajas

- Evita procesar símbolos de moneda (`$`).
- Reduce errores por espacios o saltos de línea.
- Devuelve directamente un valor numérico.
- Es más estable frente a cambios de formato visual.

---

# Ejemplos de extracción

## Precio en listado

```javascript
const precioListado = document
  .querySelector('.price .list .value')
  ?.getAttribute('content');
```

## Precio actual del producto

```javascript
const precioActual = document
  .querySelector('.prices .price .large-price .value')
  ?.getAttribute('content');
```

## Precio de lista del producto

```javascript
const precioLista = document
  .querySelector('.prices .price .list .value')
  ?.getAttribute('content');
```

---

# Resumen de selectores

| Contexto | Selector CSS | Uso |
|-----------|-----------|-----------|
| Listado de medicamentos | `.price .list .value` | Precio del producto |
| Listado de medicamentos (texto visible) | `.price .price-original .value` | Precio mostrado al usuario |
| Producto individual | `.prices .price .large-price .value` | Precio actual |
| Producto individual | `.prices .price .list .value` | Precio de lista o anterior |

## Última verificación

- **Fuente:** Sitio web de Fybeca
- **Método:** Inspección manual mediante Chrome DevTools
- **Propósito:** Identificar selectores HTML para extracción automática de precios
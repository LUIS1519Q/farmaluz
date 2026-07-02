# Documentación de Requisitos y Casos de Uso

## RF-01
* **ID:** RF-01
* **Nombre:** Buscar medicamento por nombre o principio activo
* **Descripción:** Permite al usuario buscar medicamentos ingresando el nombre comercial o el principio activo.
* **Actor principal:** Usuario
* **Precondición:** El usuario se encuentra en la pantalla de búsqueda y existe conexión con la base de datos.
* **Flujo principal:**
  1. El usuario ingresa el nombre o principio activo.
  2. El sistema procesa la búsqueda.
  3. El sistema consulta la base de datos.
  4. El sistema muestra los medicamentos encontrados.
* **Flujo alternativo:**
  1. No existen coincidencias para la búsqueda.
  2. El sistema muestra un mensaje indicando que no se encontraron resultados.
* **Postcondición:** Se muestran los resultados de la búsqueda o un mensaje informativo.
* **Prioridad:** Alta
* **Sprint:** 1

---

## RF-02
* **ID:** RF-02
* **Nombre:** Mostrar precio techo oficial de CNFPRM/ARCSA
* **Descripción:** Permite visualizar el precio techo oficial registrado para un medicamento.
* **Actor principal:** Sistema
* **Precondición:** El medicamento seleccionado existe en la base de datos y posee precio oficial registrado.
* **Flujo principal:**
  1. El sistema identifica el medicamento seleccionado.
  2. Consulta la información oficial.
  3. Muestra el precio techo vigente.
* **Flujo alternativo:**
  1. No existe información oficial disponible.
  2. El sistema informa que el precio no se encuentra registrado.
* **Postcondición:** El precio techo oficial queda visible para el usuario.
* **Prioridad:** Alta
* **Sprint:** 1

---

## RF-03
* **ID:** RF-03
* **Nombre:** Mostrar precio cobrado por farmacia vía scraping
* **Descripción:** Obtiene y muestra los precios de venta de medicamentos en farmacias registradas.
* **Actor principal:** Sistema
* **Precondición:** Existe conexión a Internet y las fuentes de información están disponibles.
* **Flujo principal:**
  1. El sistema ejecuta el proceso de scraping.
  2. Obtiene los precios de las farmacias.
  3. Procesa la información obtenida.
  4. Muestra los precios encontrados.
* **Flujo alternativo:**
  1. Alguna farmacia no responde o no posee datos.
  2. El sistema muestra los datos disponibles e informa las fuentes no accesibles.
* **Postcondición:** Los precios actuales de las farmacias quedan registrados y visibles.
* **Prioridad:** Media
* **Sprint:** 2

---

## RF-04
* **ID:** RF-04
* **Nombre:** Clasificar precio con semáforo VERDE / ROJO
* **Descripción:** Clasifica los precios según su comparación con el precio oficial.
* **Actor principal:** Sistema
* **Precondición:** Existen datos del precio oficial y del precio de venta.
* **Flujo principal:**
  1. El sistema compara ambos precios.
  2. Determina si el valor cumple con el límite permitido.
  3. Asigna una clasificación visual.
  4. Muestra el semáforo correspondiente.
* **Flujo alternativo:**
  1. Faltan datos para realizar la comparación.
  2. El sistema informa que no puede clasificar el precio.
* **Postcondición:** El medicamento queda clasificado visualmente mediante semáforo.
* **Prioridad:** Alta
* **Sprint:** 2

---

## RF-05
* **ID:** RF-05
* **Nombre:** Mostrar porcentaje de sobreprecio cuando es ROJO
* **Descripción:** Calculates y muestra el porcentaje de sobreprecio cuando el valor supera el precio oficial.
* **Actor principal:** Sistema
* **Precondición:** El medicamento ha sido clasificado con semáforo rojo.
* **Flujo principal:**
  1. El sistema calcula la diferencia entre precios.
  2. Obtiene el porcentaje de sobreprecio.
  3. Muestra el resultado al usuario.
* **Flujo alternativo:**
  1. Los datos son insuficientes para realizar el cálculo.
  2. El sistema muestra una advertencia.
* **Postcondición:** El porcentaje de sobreprecio queda visible para el usuario.
* **Prioridad:** Alta
* **Sprint:** 2

---

## RF-06
* **ID:** RF-06
* **Nombre:** Sugerir equivalentes genéricos más baratos
* **Descripción:** Recomienda medicamentos genéricos equivalentes con menor costo.
* **Actor principal:** Sistema
* **Precondición:** Existen equivalentes genéricos registrados para el medicamento consultado.
* **Flujo principal:**
  1. El sistema identifica el medicamento.
  2. Busca alternativas genéricas equivalentes.
  3. Ordena las opciones por precio.
  4. Presenta las recomendaciones al usuario.
* **Flujo alternativo:**
  1. No existen genéricos equivalentes registrados.
  2. El sistema informa que no hay alternativas disponibles.
* **Postcondición:** El usuario visualiza las opciones genéricas recomendadas.
* **Prioridad:** Media
* **Sprint:** 2

---

## RF-07
* **ID:** RF-07
* **Nombre:** Scraper actualiza precios automáticamente con cron job
* **Descripción:** Actualiza automáticamente los precios almacenados mediante tareas programadas.
* **Actor principal:** Sistema
* **Precondición:** El servicio de actualización automática está configurado y activo.
* **Flujo principal:**
  1. Se ejecuta la tarea programada.
  2. El sistema obtiene nuevos precios.
  3. Actualiza la base de datos.
  4. Registra la fecha y hora de actualización.
* **Flujo alternativo:**
  1. Ocurre un error durante la actualización.
  2. El sistema registra el incidente y conserva los datos anteriores.
* **Postcondición:** La base de datos queda actualizada con la información más reciente.
* **Prioridad:** Media
* **Sprint:** 2

---

## RF-08
* **ID:** RF-08
* **Nombre:** Importar listado oficial de CNFPRM desde CSV
* **Descripción:** Permite cargar información oficial desde archivos CSV.
* **Actor principal:** Administrador
* **Precondición:** El administrador ha iniciado sesión y dispone de un archivo CSV válido.
* **Flujo principal:**
  1. El administrador selecciona el archivo CSV.
  2. El sistema valida el formato.
  3. Importa la información.
  4. Almacena los datos en la base de datos.
  5. Confirma la importación exitosa.
* **Flujo alternativo:**
  1. El archivo presenta errores o formato incorrecto.
  2. El sistema rechaza la importación y muestra los errores detectados.
* **Postcondición:** Los datos oficiales quedan cargados en el sistema.
* **Prioridad:** Alta
* **Sprint:** 1

---

## RF-09
* **ID:** RF-09
* **Nombre:** Chatbot responde preguntas de dosis y uso
* **Descripción:** Permite a los usuarios realizar consultas sobre dosis y uso de medicamentos mediante un chatbot.
* **Actor principal:** Usuario
* **Precondición:** El chatbot se encuentra disponible y el usuario tiene acceso al sistema.
* **Flujo principal:**
  1. El usuario formula una pregunta.
  2. El chatbot procesa la consulta.
  3. Obtiene la información correspondiente.
  4. Genera una respuesta.
  5. Muestra la respuesta al usuario.
* **Flujo alternativo:**
  1. La consulta no puede ser interpretada.
  2. El chatbot solicita reformular la pregunta.
* **Postcondición:** El usuario recibe una respuesta o una solicitud de aclaración.
* **Prioridad:** Media
* **Sprint:** 3

---

## RF-10
* **ID:** RF-10
* **Nombre:** Historial de consultas del usuario en sesión activa
* **Descripción:** Registra y muestra el historial de consultas realizadas durante la sesión actual.
* **Actor principal:** Usuario
* **Precondición:** El usuario ha realizado al menos una consulta durante la sesión.
* **Flujo principal:**
  1. El usuario accede al historial.
  2. El sistema recupera las consultas realizadas.
  3. Muestra el listado ordenado cronológicamente.
* **Flujo alternativo:**
  1. No existen consultas registradas.
  2. El sistema muestra un mensaje indicando que el historial está vacío.
* **Postcondición:** El historial de consultas queda disponible para revisión.
* **Prioridad:** Baja
* **Sprint:** 4

---
---

## CASO DE USO CU-01
* **ID Caso de Uso:** CU-01
* **RF asociado:** RF-01
* **Nombre:** Buscar medicamento por nombre comercial o principio activo
* **Actor:** Usuario
* **Descripción:** Permite al usuario buscar medicamentos mediante el nombre comercial o el principio activo para obtener información relacionada.
* **Precondición:** El sistema se encuentra operativo y la base de datos contiene información de medicamentos.
* **Flujo principal:**
  1. El usuario accede al buscador.
  2. Ingresa el nombre comercial o principio activo.
  3. Presiona el botón de búsqueda.
  4. El sistema valida la información ingresada.
  5. El sistema consulta la base de datos.
  6. El sistema muestra los medicamentos encontrados.
* **Flujo alternativo:**
  1. El usuario ingresa una búsqueda parcial.
  2. El sistema muestra coincidencias relacionadas.
* **Flujo de excepción:**
  1. El usuario deja el campo vacío.
  2. El sistema muestra un mensaje indicando que debe ingresar un criterio de búsqueda.
* **Postcondición:** Los resultados de la búsqueda son mostrados al usuario.

---

## CASO DE USO CU-02
* **ID Caso de Uso:** CU-02
* **RF asociado:** RF-02
* **Nombre:** Consultar precio techo oficial de un medicamento
* **Actor:** Usuario
* **Descripción:** Permite consultar el precio techo oficial establecido para un medicamento.
* **Precondición:** El medicamento debe existir en la base de datos y tener información oficial registrada.
* **Flujo principal:**
  1. El usuario selecciona un medicamento.
  2. El sistema identifica el medicamento.
  3. Consulta la información oficial.
  4. Muestra el precio techo autorizado.
* **Flujo alternativo:**
  1. El usuario accede desde los resultados de búsqueda.
  2. El sistema muestra directamente el precio oficial.
* **Flujo de excepción:**
  1. No existe precio oficial registrado.
  2. El sistema informa que no se dispone de información oficial.
* **Postcondición:** El usuario visualiza el precio techo oficial del medicamento.

---

## CASO DE USO CU-03
* **ID Caso de Uso:** CU-03
* **RF asociado:** RF-03
* **Nombre:** Ver precio cobrado por farmacia en tiempo real
* **Actor:** Usuario
* **Descripción:** Permite visualizar los precios reportados por diferentes farmacias para un medicamento específico.
* **Precondición:** Existe conexión a Internet y las fuentes de información están disponibles.
* **Flujo principal:**
  1. El usuario selecciona un medicamento.
  2. El sistema ejecuta el proceso de obtención de precios.
  3. Recupera la información de las farmacias.
  4. Procesa los datos obtenidos.
  5. Muestra los precios encontrados.
* **Flujo alternativo:**
  1. Algunas farmacias no disponen de información.
  2. El sistema muestra únicamente los datos recuperados.
* **Flujo de excepción:**
  1. Ocurre un error de conexión.
  2. El sistema informa que no fue posible obtener los precios.
* **Postcondición:** Los precios disponibles son visualizados por el usuario.

---

## CASO DE USO CU-04
* **ID Caso de Uso:** CU-04
* **RF asociado:** RF-04
* **Nombre:** Ver clasificación semáforo VERDE o ROJO de un precio
* **Actor:** Usuario
* **Descripción:** Permite visualizar la clasificación del precio de un medicamento comparándolo con el precio oficial.
* **Precondición:** Existen datos del precio oficial y del precio comercial.
* **Flujo principal:**
  1. El usuario consulta un medicamento.
  2. El sistema compara los precios.
  3. Determina la clasificación correspondiente.
  4. Muestra el semáforo VERDE o ROJO.
* **Flujo alternativo:**
  1. El usuario consulta varios resultados.
  2. El sistema clasifica cada uno individualmente.
* **Flujo de excepción:**
  1. No existe información suficiente para realizar la comparación.
  2. El sistema informa que no puede generar la clasificación.
* **Postcondición:** La clasificación del precio queda visible para el usuario.

---

## CASO DE USO CU-05
* **ID Caso de Uso:** CU-05
* **RF asociado:** RF-05
* **Nombre:** Ver porcentaje exacto de sobreprecio ilegal
* **Actor:** Usuario
* **Descripción:** Permite visualizar el porcentaje de sobreprecio cuando un medicamento supera el precio oficial permitido.
* **Precondición:** El precio consultado ha sido clasificado con semáforo rojo.
* **Flujo principal:**
  1. El usuario consulta un medicamento clasificado en rojo.
  2. El sistema calcula la diferencia de precios.
  3. Calcula el porcentaje de sobreprecio.
  4. Muestra el resultado.
* **Flujo alternativo:**
  1. El usuario consulta varios medicamentos.
  2. El sistema muestra el porcentaje para cada uno.
* **Flujo de excepción:**
  1. Los datos requeridos para el cálculo son insuficientes.
  2. El sistema informa que no puede calcular el porcentaje.
* **Postcondición:** El porcentaje de sobreprecio es mostrado al usuario.

---

## CASO DE USO CU-06
* **ID Caso de Uso:** CU-06
* **RF asociado:** RF-06
* **Nombre:** Ver sugerencias de medicamentos genéricos equivalentes
* **Actor:** Usuario
* **Descripción:** Permite visualizar alternativas genéricas equivalentes con menor precio.
* **Precondición:** Existen medicamentos genéricos relacionados en la base de datos.
* **Flujo principal:**
  1. El usuario consulta un medicamento.
  2. El sistema identifica posibles equivalentes.
  3. Ordena las alternativas por precio.
  4. Muestra las recomendaciones.
* **Flujo alternativo:**
  1. Existen varias alternativas disponibles.
  2. El sistema muestra todas las opciones encontradas.
* **Flujo de excepción:**
  1. No existen equivalentes registrados.
  2. El sistema informa que no hay alternativas disponibles.
* **Postcondición:** El usuario visualiza medicamentos genéricos recomendados.

---

## CASO DE USO CU-07
* **ID Caso de Uso:** CU-07
* **RF asociado:** RF-07
* **Nombre:** Sistema actualiza precios automáticamente vía scraping
* **Actor:** Sistema
* **Descripción:** Permite actualizar automáticamente los precios de medicamentos mediante procesos programados.
* **Precondición:** El servicio automático se encuentra configurado y activo.
* **Flujo principal:**
  1. Se ejecuta la tarea programada.
  2. El sistema consulta las fuentes externas.
  3. Obtiene información actualizada.
  4. Actualiza la base de datos.
  5. Registra la fecha de actualización.
* **Flujo alternativo:**
  1. Una fuente externa no responde.
  2. El sistema continúa con las fuentes disponibles.
* **Flujo de excepción:**
  1. Ocurre un error durante la actualización.
  2. El sistema registra el error y conserva los datos anteriores.
* **Postcondición:** La información de precios queda actualizada.

---

## CASO DE USO CU-08
* **ID Caso de Uso:** CU-08
* **RF asociado:** RF-08
* **Nombre:** Administrador importa listado oficial CNFPRM desde CSV
* **Actor:** Administrador
* **Descripción:** Permite cargar información oficial de medicamentos mediante archivos CSV.
* **Precondición:** El administrador ha iniciado sesión y dispone de un archivo CSV válido.
* **Flujo principal:**
  1. El administrador accede al módulo de importación.
  2. Selecciona un archivo CSV.
  3. El sistema valida el formato.
  4. Importa los registros.
  5. Almacena la información.
  6. Muestra un mensaje de éxito.
* **Flujo alternativo:**
  1. Algunos registros contienen errores menores.
  2. El sistema importa los registros válidos y reporta los errores encontrados.
* **Flujo de excepción:**
  1. El archivo posee formato incorrecto.
  2. El sistema cancela la importación y muestra el motivo.
* **Postcondición:** La información oficial queda registrada en el sistema.

---

## CASO DE USO CU-09
* **ID Caso de Uso:** CU-09
* **RF asociado:** RF-09
* **Nombre:** Usuario consulta chatbot sobre dosis y uso de medicamento
* **Actor:** Usuario
* **Descripción:** Permite realizar consultas relacionadas con dosis y uso de medicamentos mediante un chatbot.
* **Precondición:** El chatbot se encuentra disponible y conectado.
* **Flujo principal:**
  1. El usuario accede al chatbot.
  2. Escribe una consulta.
  3. El chatbot procesa la solicitud.
  4. Busca información relacionada.
  5. Genera una respuesta.
  6. Muestra la respuesta al usuario.
* **Flujo alternativo:**
  1. El usuario realiza preguntas adicionales.
  2. El chatbot continúa la conversación utilizando el contexto actual.
* **Flujo de excepción:**
  1. La consulta no puede ser interpretada.
  2. El chatbot solicita reformular la pregunta.
* **Postcondición:** El usuario recibe una respuesta relacionada con su consulta.

---

## CASO DE USO CU-10
* **ID Caso de Uso:** CU-10
* **RF asociado:** RF-10
* **Nombre:** Usuario consulta historial de búsquedas de la sesión activa
* **Actor:** Usuario
* **Descripción:** Permite visualizar el historial de consultas realizadas durante la sesión actual.
* **Precondición:** El usuario ha realizado al menos una búsqueda durante la sesión.
* **Flujo principal:**
  1. El usuario accede al historial.
  2. El sistema recupera las consultas almacenadas.
  3. Organiza los resultados cronológicamente.
  4. Muestra el historial completo.
* **Flujo alternativo:**
  1. El usuario selecciona una consulta anterior.
  2. El sistema vuelve a mostrar la información relacionada.
* **Flujo de excepción:**
  1. No existen consultas registradas.
  2. El sistema informa que el historial está vacío.
* **Postcondición:** El historial de consultas queda disponible para revisión.
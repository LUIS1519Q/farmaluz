# Sprint 1 — Documentación de Avance

**Responsable:** Luis Paspuezán – Backend + DevOps + Líder

---

## Día 1 — 19/20 de junio 2025

### Qué se hizo
- Conexión SSH a la instancia EC2 establecida
- Dependencias instaladas en el servidor: python3-pip, python3-venv, nginx, git
- Proyecto FastAPI creado en local (`~/Desktop/farmaluz/backend`)
- Entorno virtual local creado y activado
- Endpoint raíz `GET /` probado en `127.0.0.1:8000` → `{"status":"OK"}`
- `requirements.txt`, `.gitignore`, `.env.example` generados
- Todo pusheado a `feature/sprint0`

### Evidencia
Ver `docs/capturas/Backend-Devops/sprint1/dia1_endpoint_local.png`, `dia1_push_github.png`

---

## Día 2 — 21 de junio 2025

### Qué se hizo
- Repositorio clonado en el servidor EC2 (`~/apps/farmaluz`)
- Entorno virtual creado en el servidor + dependencias instaladas (`pip install -r requirements.txt`)
- FastAPI probado manualmente con `uvicorn main:app --host 0.0.0.0 --port 8000`
- Verificado acceso público vía IP del EC2: `http://18.225.130.85:8000`
- Nginx configurado como proxy reverso (puerto 80 → 8000), permitiendo acceso sin especificar puerto
- Creados endpoints mock en `routers/medicamentos.py`:
  - `GET /medicamentos` — lista de medicamentos (datos simulados, pendiente integración con MongoDB de Sanchez)
  - `GET /medicamentos/{id}` — detalle de un medicamento
- Endpoints conectados en `main.py` vía `app.include_router(medicamentos.router)`
- Verificación final en documentación automática de FastAPI: `http://18.225.130.85/docs`

### Decisión técnica
Se usaron datos mock para `/medicamentos` porque Sanchez aún no termina los CRUDs de MongoDB (previsto en el documento oficial del sprint). Se reemplazarán por datos reales en cuanto esté disponible la conexión a MongoDB Atlas.

### Evidencia
Ver `docs/capturas/Backend-Devops/sprint1/` — capturas: clone en EC2, venv + dependencias, uvicorn corriendo, navegador con IP pública, nginx status, endpoint /medicamentos, pantalla /docs

### Entregables completados
- ✅ Instancia EC2 corriendo Ubuntu 24.04
- ✅ FastAPI desplegado y accesible públicamente
- ✅ Nginx configurado (puerto 80)
- ✅ Endpoints GET /medicamentos y GET /medicamentos/{id} funcionando
- ✅ Documentación automática visible en /docs

### Evidencia — Día 1

![Endpoint local funcionando](../capturas/Backend-Devops/sprint1/dia1_endpoint_local.png)

![Push a GitHub](../capturas/Backend-Devops/sprint1/dia1_push_github.png)

### Evidencia — Día 2

![Clone del repo en EC2](../capturas/Backend-Devops/sprint1/dia2_clone_ec2.png)

![Uvicorn corriendo en el servidor](../capturas/Backend-Devops/sprint1/dia2_uvicorn_servidor.png)

![Endpoint /medicamentos respondiendo](../capturas/Backend-Devops/sprint1/dia2_medicamentos_endpoint.png)

![Documentación Swagger /docs](../capturas/Backend-Devops/sprint1/dia2_docs_swagger.png)
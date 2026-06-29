# Sprint 4 — Día 1 | Paspuezán Luis | Backend + DevOps
**Fecha:** Domingo 29 de junio de 2026
**Rama:** feature/sprint4

## ¿Qué hice hoy?
- Verifiqué la configuración del servicio systemd `farmaluz.service` — confirmado con `Restart=always`, `RestartSec=3` y estado `enabled`
- Probé recuperación automática del servicio matando el proceso con `kill -9` — systemd lo reinició solo en menos de 3 segundos
- Revisé uso de memoria y CPU de la instancia EC2 — métricas estables y dentro de límites seguros para la demo
- Creé y probé `deploy.sh` — script de respaldo para redespliegue rápido en caso de falla durante la demo

## Decisiones técnicas
- **No se modificó `farmaluz.service`** — el archivo ya tenía `Restart=always` y `RestartSec=3` correctamente configurados desde Sprint 1. No era necesario tocarlo
- **`deploy.sh` hace `git pull origin main`** — el script apunta a `main` porque en producción el EC2 siempre debe correr la rama estable. Durante la demo se hará el merge final a `main` antes del mediodía
- **Sin configuración de swap** — la instancia t3.micro tiene 911MB de RAM con 435MB disponibles. Configurar swap a horas de la demo representaba un riesgo innecesario; se monitorea manualmente si hay picos

## Métricas del servidor
| Métrica | Valor | Estado |
|---------|-------|--------|
| RAM usada | 475Mi / 911Mi (52%) | ✅ Estable |
| RAM disponible | 435Mi | ✅ Suficiente |
| CPU idle | 95.5% | ✅ Sin carga |
| Disco usado | 3.4G / 19G (19%) | ✅ Holgado |

## Pruebas realizadas

**Prueba 1 — Verificación de configuración systemd:**
- Comando: `cat /etc/systemd/system/farmaluz.service`
- Resultado: `Restart=always`, `RestartSec=3`, `enabled` ✅

**Prueba 2 — Recuperación automática tras caída forzada:**
- Acción: `sudo kill -9 95195`
- Resultado: systemd reinició el servicio con PID `96317` en menos de 3 segundos — `restart counter is at 1` ✅

**Prueba 3 — Deploy script:**
- Comando: `bash deploy.sh`
- Resultado: git pull, pip install, restart y status verificado — `🎉 Redespliegue completado` ✅

## Evidencia
![Servicio habilitado](../capturas/Backend-Devops/sprint4/dia1_service_enabled.png)

![Reinicio automático](../capturas/Backend-Devops/sprint4/dia1_restart_automatico.png)

![Memoria y CPU](../capturas/Backend-Devops/sprint4/dia1_memoria_cpu.png)

![Deploy script](../capturas/Backend-Devops/sprint4/dia1_deploy_sh.png)

## ¿Qué falta?
- Confirmar que el sistema completo está arriba antes del mediodía (Día 2)
- Ensayo completo de la demo con el equipo (Día 2)
- Tener plan B con capturas si EC2 falla en vivo (Día 2)
- Merge final `feature/sprint4` → `develop` → `main` (Día 2)
- Confirmar que el repositorio tiene todo: código, docs, diagramas, manuales (Día 2)
# Sprint 4 — Día 2 | Paspuezán Luis | Backend + DevOps
**Fecha:** Lunes 29 de junio de 2026
**Rama:** feature/sprint4

## ¿Qué hice hoy?
- Verifiqué que todos los endpoints del backend estaban operativos antes del mediodía
- Identifiqué que Gemini está saturado (503) — el fallback responde correctamente con mensaje amigable
- Realicé merge final `feature/sprint4` → `develop` → `main`
- Confirmé que el CI/CD desplegó automáticamente en EC2 tras el push a `main`
- Verifiqué que el repositorio tiene toda la documentación, diagramas y capturas completas

## Decisiones técnicas
- **Chatbot con fallback activo** — Gemini responde 503 por saturación. El endpoint devuelve 200 OK con mensaje amigable. Para la demo se usarán las capturas del Sprint 3 como respaldo donde el chatbot respondió correctamente
- **Merge directo sin hotfix** — el sistema estaba estable, no hubo necesidad de correcciones de último momento
- **QA de Mateo Males** — no se observaron docs de testing en el repositorio; se notificó al equipo antes de la demo

## Endpoints verificados en producción

| Endpoint | Resultado |
|----------|-----------|
| `GET /medicamentos/` | ✅ Devuelve catálogo CNFRPM/ARCSA |
| `GET /medicamentos/{id}` | ✅ Devuelve medicamento por ObjectId |
| `GET /comparacion/{id}` | ✅ 404 correcto sin precio scrapeado |
| `POST /auditoria` | ✅ Registra en MongoDB Atlas |
| `POST /chatbot/consulta` | ⚠️ Fallback activo — Gemini saturado |

## Pruebas realizadas

**Prueba 1 — Verificación completa de endpoints:**
- Todos los endpoints respondieron correctamente vía `curl` desde EC2
- Auditoría registró documento con ID `6a41fedcc03fc7641ce02094` en MongoDB ✅

**Prueba 2 — CI/CD automático:**
- Push a `main` disparó GitHub Actions
- Workflow completado en 8s — `git pull` + `systemctl restart` ejecutados en EC2 ✅

**Prueba 3 — Estado final del servicio:**
- PID `96746`, `active (running)`, memoria 85.7MB, arranque limpio ✅

## Evidencia
![Endpoints verificados](../capturas/Backend-Devops/sprint4/dia2_endpoints_verificados.png)

![GitHub Actions verde](../capturas/Backend-Devops/sprint4/dia2_actions_verde.png)

![Merge final a main](../capturas/Backend-Devops/sprint4/dia2_merge_main.png)

## ¿Qué falta?
- Ensayo final de la demo con el equipo
- Tener plan B con capturas del chatbot funcionando (Sprint 3) por si Gemini sigue saturado
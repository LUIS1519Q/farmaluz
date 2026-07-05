from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import medicamentos, precios, chatbot, comparacion, auditoria, dashboard

app = FastAPI(title="API FarmaLuz")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(precios.router)
app.include_router(medicamentos.router)
app.include_router(chatbot.router)
app.include_router(comparacion.router)
app.include_router(auditoria.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"status": "OK", "message": "Bienvenido a la API de FarmaLuz"}

@app.on_event("startup")
def startup_event():
    for route in app.routes:
        if hasattr(route, "path"):
            print(f"Ruta registrada: {route.path}")
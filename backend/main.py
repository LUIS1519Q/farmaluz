from fastapi import FastAPI
from routers import medicamentos, chatbot

app = FastAPI(title="API FarmaLuz")

app.include_router(medicamentos.router)
app.include_router(chatbot.router)
@app.get("/")
def read_root():
    return {"status": "OK", "message": "Bienvenido a la API de FarmaLuz"}
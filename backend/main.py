from fastapi import FastAPI
from routers import medicamentos

app = FastAPI()

app.include_router(medicamentos.router)

@app.get("/")
def read_root():
    return {"status": "OK"}
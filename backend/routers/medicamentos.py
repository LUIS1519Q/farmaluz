from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/medicamentos",
    tags=["medicamentos"]
)

medicamentos_mock = [
    {"id": 1, "nombre": "Paracetamol 500mg", "precio_techo": 1.20, "farmacia": "Fybeca"},
    {"id": 2, "nombre": "Ibuprofeno 400mg", "precio_techo": 1.85, "farmacia": "Cruz Azul"},
    {"id": 3, "nombre": "Amoxicilina 500mg", "precio_techo": 3.50, "farmacia": "Fybeca"},
    {"id": 4, "nombre": "Loratadina 10mg", "precio_techo": 2.10, "farmacia": "Cruz Azul"},
    {"id": 5, "nombre": "Omeprazol 20mg", "precio_techo": 2.75, "farmacia": "Fybeca"},
]

@router.get("/")
def listar_medicamentos():
    return medicamentos_mock

@router.get("/{medicamento_id}")
def obtener_medicamento(medicamento_id: int):
    for med in medicamentos_mock:
        if med["id"] == medicamento_id:
            return med
    raise HTTPException(status_code=404, detail="Medicamento no encontrado")
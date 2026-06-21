from fastapi import APIRouter, HTTPException
from models import MedicamentoGenerico # Importa tu modelo

router = APIRouter(
    prefix="/medicamentos",
    tags=["medicamentos"]
)

medicamentos_mock = [
    MedicamentoGenerico(nombre="Paracetamol 500mg", principio_activo="Paracetamol", precio_referencial=1.20, laboratorio="Fybeca"),
    MedicamentoGenerico(nombre="Ibuprofeno 400mg", principio_activo="Ibuprofeno", precio_referencial=1.85, laboratorio="Cruz Azul"),
    MedicamentoGenerico(nombre="Amoxicilina 500mg", principio_activo="Amoxicilina", precio_referencial=3.50, laboratorio="Fybeca"),
    MedicamentoGenerico(nombre="Loratadina 10mg", principio_activo="Loratadina", precio_referencial=2.10, laboratorio="Cruz Azul"),
    MedicamentoGenerico(nombre="Omeprazol 20mg", principio_activo="Omeprazol", precio_referencial=2.75, laboratorio="Fybeca")z,
]

# Actualizar los endpoints para usar response_model
@router.get("/", response_model=list[MedicamentoGenerico]) 
def listar_medicamentos():
    return medicamentos_mock

@router.get("/{medicamento_id}", response_model=MedicamentoGenerico)
def obtener_medicamento(medicamento_id: int):
    for med in medicamentos_mock:
        if med["id"] == medicamento_id:
            return med
    raise HTTPException(status_code=404, detail="Medicamento no encontrado")
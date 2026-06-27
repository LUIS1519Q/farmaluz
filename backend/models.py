from pydantic import BaseModel

class MedicamentoGenerico(BaseModel):
    id: int
    nombre: str
    principio_activo: str 
    precio_referencial: float
    laboratorio: str

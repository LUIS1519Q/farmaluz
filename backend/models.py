from pydantic import BaseModel

class MedicamentoGenerico(BaseModel):
    id: int
    nombre: str
    principio_activo: str 
    precio_techo: float
    farmacia: str

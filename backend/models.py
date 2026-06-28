from typing import List
from pydantic import BaseModel

class MedicamentoGenerico(BaseModel):
    id: int
    nombre: str
    principio_activo: str 
    precio_referencial: float
    laboratorio: str


class RespuestaComparacion(BaseModel):
    medicamento_original: str
    precio_original: float
    ahorro_estimado: float
    genericos_alternativos: List[MedicamentoGenerico]
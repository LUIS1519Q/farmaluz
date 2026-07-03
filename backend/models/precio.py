from datetime import datetime

from pydantic import BaseModel

from backend.models.producto_farmacia import ProductoFarmacia


class Precio(BaseModel):

    medicamento_id: str

    farmacia: str

    producto: ProductoFarmacia

    score: int

    precio_techo: float

    supera_precio_techo: bool

    diferencia: float

    porcentaje_diferencia: float

    semaforo: str

    ultima_actualizacion: datetime

    class Config:
        populate_by_name = True
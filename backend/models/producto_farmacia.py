from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class ProductoFarmacia(BaseModel):

    farmacia: str

    nombre_producto: str

    principio_activo: Optional[str] = None

    principios_activos: list[str] = Field(default_factory=list)

    concentraciones: list[str] = Field(default_factory=list)

    presentacion: Optional[str] = None

    marca: Optional[str] = None

    laboratorio: Optional[str] = None

    fecha_elaboracion: Optional[str] = None

    fecha_vencimiento: Optional[str] = None

    dosificacion: Optional[str] = None

    tipo_presentacion: Optional[str] = None

    precio: float

    url: HttpUrl

    score: Optional[int] = None

    ultima_actualizacion: Optional[datetime] = None

    class Config:
        populate_by_name = True
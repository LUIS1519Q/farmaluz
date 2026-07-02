from typing import List

from pydantic import BaseModel

from backend.models.producto_farmacia import ProductoFarmacia


class DetalleComparacion(BaseModel):

    coincide: bool

    puntaje: int

    descripcion: str


class ResultadoComparacion(BaseModel):

    producto: ProductoFarmacia

    score: int

    coincide: bool

    principio_activo: DetalleComparacion

    concentracion: DetalleComparacion

    presentacion: DetalleComparacion

    marca: DetalleComparacion

    explicacion: List[str]
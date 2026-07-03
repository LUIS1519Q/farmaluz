from pydantic import BaseModel
from typing import Optional


class Medicamento(BaseModel):

    id: Optional[str] = None

    resolucion: Optional[str] = None

    item: Optional[str] = None

    sesion_consejo: Optional[str] = None

    principio_activo: str

    primer_nivel_desagregacion: Optional[str] = None

    forma_farmaceutica: Optional[str] = None

    concentracion: Optional[str] = None

    presentacion_comercial: Optional[str] = None

    precio_techo: float

    class Config:
        populate_by_name = True
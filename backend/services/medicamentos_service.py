from typing import List, Optional

from bson import ObjectId

from backend.database import db
from backend.models.medicamento import Medicamento



class MedicamentosService:

    COLLECTION = db.medicamentos

    @staticmethod
    def convertir_documento(
        documento: dict
    ) -> Medicamento:

        precio = next(
            (
                valor
                for clave, valor in documento.items()
                if "Precio Techo" in clave
            ),
            0
        )

        try:
            precio_techo = float(
                str(precio or 0)
                .replace("$", "")
                .replace(",", "")
                .strip()
            )
        except ValueError:
            precio_techo = 0.0

        return Medicamento(

            id=str(documento.get("_id")),

            resolucion=(documento.get("Resolución") or "").strip(),

            item=(documento.get("Item") or "").strip(),

            sesion_consejo=(documento.get("Sesión de Consejo") or "").strip(),

            principio_activo=(documento.get("Principio Activo") or "").strip(),

            primer_nivel_desagregacion=(
                documento.get("Primer Nivel de Desagregación") or ""
            ).strip(),

            forma_farmaceutica=(
                documento.get("Forma Farmacéutica") or ""
            ).strip(),

            concentracion=(
                documento.get("Concentración ") or ""
            ).strip(),

            presentacion_comercial=(
                documento.get("Presentación Comercial ") or ""
            ).strip(),

            precio_techo=precio_techo

        )

        

    @classmethod
    def obtener_por_id(
        cls,
        medicamento_id: str
    ) -> Optional[Medicamento]:

        documento = cls.COLLECTION.find_one(

            {
                "_id": ObjectId(
                    medicamento_id
                )
            }

        )

        if documento is None:

            return None

        return cls.convertir_documento(
            documento
        )

    @classmethod
    def obtener_por_principio_activo(
        cls,
        principio_activo: str
    ) -> List[Medicamento]:

        documentos = cls.COLLECTION.find(

            {
                "Principio Activo": {
                    "$regex": f"^{principio_activo}$",
                    "$options": "i"
                }
            }

        )

        return [

            cls.convertir_documento(doc)

            for doc in documentos

        ]

    @classmethod
    def obtener_todos(
        cls,
        limite: Optional[int] = None
    ) -> List[Medicamento]:

        cursor = cls.COLLECTION.find()

        if limite is not None:

            cursor = cursor.limit(
                limite
            )

        return [

            cls.convertir_documento(doc)

            for doc in cursor

        ]

    @classmethod
    def buscar(
        cls,
        filtro: dict
    ) -> List[Medicamento]:

        documentos = cls.COLLECTION.find(
            filtro
        )

        return [

            cls.convertir_documento(doc)

            for doc in documentos

        ]

    @classmethod
    def contar(
        cls
    ) -> int:

        return cls.COLLECTION.count_documents(
            {}
        )
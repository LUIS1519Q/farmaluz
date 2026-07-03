from datetime import datetime, UTC
from typing import List, Optional

from backend.database import db
from backend.models.precio import Precio


class PreciosService:

    COLLECTION = db.precios

    @classmethod
    def guardar(
        cls,
        precio: Precio
    ):

        existente = cls.COLLECTION.find_one(

            {
                "medicamento_id": precio.medicamento_id,
                "farmacia": precio.farmacia
            }

        )

        campos_redundantes = {

            "producto": "",
            "score": "",
            "diferencia": "",
            "porcentaje_diferencia": "",
            "semaforo": "",
            "supera_precio_techo": "",
            "marca": "",
            "laboratorio": "",
            "presentacion": "",
            "principios_activos": "",
            "concentraciones": "",

        }

        if existente and existente.get("precio") == precio.producto.precio:

            set_sin_fecha = {}

            if existente.get("precio_techo") != precio.precio_techo:

                set_sin_fecha["precio_techo"] = precio.precio_techo

            if any(campo in existente for campo in campos_redundantes) or set_sin_fecha:

                actualizacion = {
                    "$unset": campos_redundantes
                }

                if set_sin_fecha:

                    actualizacion["$set"] = set_sin_fecha

                cls.COLLECTION.update_one(

                    {
                        "medicamento_id": precio.medicamento_id,
                        "farmacia": precio.farmacia
                    },

                    actualizacion,

                    upsert=True

                )

            return False

        concentracion = ""

        if precio.producto.concentraciones:

            concentracion = precio.producto.concentraciones[0]

        documento = {

            "medicamento_id": precio.medicamento_id,

            "farmacia": precio.farmacia,

            "nombre_producto": precio.producto.nombre_producto,

            "principio_activo": precio.producto.principio_activo,

            "concentracion": concentracion,

            "precio": precio.producto.precio,

            "precio_techo": precio.precio_techo,

            "url": str(precio.producto.url),

            "ultima_actualizacion": precio.ultima_actualizacion

        }

        cls.COLLECTION.update_one(

            {
                "medicamento_id": precio.medicamento_id,
                "farmacia": precio.farmacia
            },

            {
                "$set": documento,

                "$unset": campos_redundantes
            },

            upsert=True

        )

        return True

    @classmethod
    def obtener(
        cls,
        medicamento_id: str,
        farmacia: str
    ) -> Optional[dict]:

        return cls.COLLECTION.find_one(

            {
                "medicamento_id": medicamento_id,
                "farmacia": farmacia
            }

        )

    @classmethod
    def obtener_por_medicamento(
        cls,
        medicamento_id: str
    ) -> List[dict]:

        return list(

            cls.COLLECTION.find(

                {
                    "medicamento_id": medicamento_id
                }

            )

        )

    @classmethod
    def eliminar(
        cls,
        medicamento_id: str,
        farmacia: str
    ):

        cls.COLLECTION.delete_one(

            {
                "medicamento_id": medicamento_id,
                "farmacia": farmacia
            }

        )

    @classmethod
    def actualizar_fecha(
        cls,
        medicamento_id: str,
        farmacia: str
    ):

        cls.COLLECTION.update_one(

            {
                "medicamento_id": medicamento_id,
                "farmacia": farmacia
            },

            {
                "$set": {
                    "ultima_actualizacion": datetime.now(
                        UTC
                    )
                }
            }

        )

    @classmethod
    def obtener_cache(
        cls,
        medicamento_id: str,
        farmacia: str
    ) -> Optional[dict]:

        return cls.obtener(
            medicamento_id,
            farmacia
        )

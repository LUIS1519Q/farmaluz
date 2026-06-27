from backend.database import db


def obtener_medicamentos(filtro=None, limite=None):

    if filtro is None:
        filtro = {}

    consulta = db.medicamentos.find(filtro)

    if limite is not None:
        consulta = consulta.limit(limite)

    return consulta
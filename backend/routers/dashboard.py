from fastapi import APIRouter
from backend.database import db

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def obtener_stats():
    total_medicamentos = db.medicamentos.count_documents({})
    total_consultas = db.auditoria.count_documents({})
    total_fybeca = db.precios.count_documents({"farmacia": "Fybeca"})
    total_cruzazul = db.precios.count_documents({"farmacia": "Cruz Azul"})
    total_precios = db.precios.count_documents({})

    precios = list(db.precios.find({}, {"precio": 1, "precio_techo": 1}))
    total_con_sobreprecio = sum(
        1 for p in precios
        if p.get("precio") and p.get("precio_techo")
        and p["precio"] > p["precio_techo"]
    )

    porcentaje_sobreprecio = 0
    if total_precios > 0:
        porcentaje_sobreprecio = round((total_con_sobreprecio / total_precios) * 100, 1)

    return {
        "total_medicamentos": total_medicamentos,
        "total_consultas": total_consultas,
        "farmacias_activas": 2,
        "porcentaje_sobreprecio": porcentaje_sobreprecio,
        "total_fybeca": total_fybeca,
        "total_cruzazul": total_cruzazul
    }

@router.get("/top-medicamentos")
def top_medicamentos():
    pipeline = [
        {"$group": {"_id": "$nombre", "total": {"$sum": 1}}},
        {"$sort": {"total": -1}},
        {"$limit": 5}
    ]
    resultados = list(db.auditoria.aggregate(pipeline))
    return [{"nombre": r["_id"], "consultas": r["total"]} for r in resultados]

@router.get("/ultimas-consultas")
def ultimas_consultas():
    consultas = list(
        db.auditoria.find({}, {"_id": 0})
        .sort("fecha_consulta", -1)
        .limit(5)
    )
    return consultas
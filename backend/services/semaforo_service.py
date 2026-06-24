def calcular_semaforo(precio_techo: float, precio_cobrado: float) -> dict:
    """
    Compara el precio cobrado contra el precio techo legal (CNFRPM/ARCSA).
    Retorna ROJO si hay sobreprecio, VERDE si está dentro del límite.
    """
    if precio_cobrado > precio_techo:
        porcentaje = ((precio_cobrado - precio_techo) / precio_techo) * 100
        return {
            "estado": "ROJO",
            "porcentaje": round(porcentaje, 1)
        }
    return {
        "estado": "VERDE",
        "porcentaje": 0
    }
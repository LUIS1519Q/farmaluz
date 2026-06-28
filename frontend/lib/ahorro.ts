export const calcularAhorro = (precioBase: number, precioCobrado: number): number => {
    // Si no hay precio base válido o el precio cobrado es mayor o igual, no hay ahorro
    if (precioBase <= 0 || precioBase <= precioCobrado) return 0;
    
    // Fórmula de ahorro porcentual
    const ahorro = ((precioBase - precioCobrado) / precioBase) * 100;
    
    // Retorna un número limpio con máximo 2 decimales
    return parseFloat(ahorro.toFixed(2));
};
import { calcularAhorro } from '../../../lib/ahorro';

describe('Pruebas de la lógica de cálculo de ahorro', () => {
    test('Calcula el 50% de ahorro (Marca 10, Genérico 5)', () => {
        expect(calcularAhorro(10, 5)).toBe(50);
    });

    test('Devuelve 0 si los precios son iguales', () => {
        expect(calcularAhorro(10, 10)).toBe(0);
    });

    test('Devuelve 0 si el precio base (marca) es 0 o negativo', () => {
        expect(calcularAhorro(0, 5)).toBe(0);
        expect(calcularAhorro(-5, 5)).toBe(0);
    });

    test('Devuelve 0 si el precio cobrado es mayor al precio base', () => {
        expect(calcularAhorro(10, 15)).toBe(0);
    });
});
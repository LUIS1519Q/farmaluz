// Función simulada de la lógica de Vela para el cálculo de ahorro
function calcularAhorro(precioComercial, precioGenerico) {
  if (precioComercial <= 0 || precioGenerico <= 0) return 0;
  if (precioGenerico >= precioComercial) return 0;
  return parseFloat((precioComercial - precioGenerico).toFixed(2));
}

describe('Pruebas Unitarias con Jest - Lógica de Ahorro de Genéricos (Colaboración con Vela)', () => {
  
  test('Debe calcular el ahorro correcto cuando el comercial es más caro', () => {
    const resultado = calcularAhorro(10.50, 3.20);
    expect(resultado).toBe(7.30); // 10.50 - 3.20 = 7.30
  });

  test('Debe retornar 0 de ahorro si el genérico cuesta igual o más que el comercial', () => {
    const resultado = calcularAhorro(5.00, 5.50);
    expect(resultado).toBe(0);
  });

  test('Debe manejar valores de precio en cero o negativos devolviendo 0', () => {
    const resultado = calcularAhorro(-1.00, 2.00);
    expect(resultado).toBe(0);
  });
});
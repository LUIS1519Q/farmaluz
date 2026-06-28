describe('Pruebas E2E - Buscador de Farmaluz', () => {
  it('Debe buscar un medicamento real y desplegar los resultados', () => {
    // 1. Visita la pantalla de inicio local de Next.js
    cy.visit('http://localhost:3000');

    // 2. Encuentra el buscador por su placeholder común e ingresa un medicamento
    cy.get('input[placeholder*="buscar" i], input[type="text"]').first().type('Paracetamol{enter}');

    // 3. Verifica que la URL cambie a la página de resultados de Chicaiza
    cy.url().should('include', '/resultados');

    // 4. Asegura que la pantalla renderice tarjetas o resultados que contengan la búsqueda
    cy.contains('Paracetamol', { matchCase: false }).should('be.visible');
  });
});
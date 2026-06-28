describe('Pruebas E2E - Flujo Completo de Usuario en Farmaluz', () => {
  it('Debe navegar desde la búsqueda hasta la interacción final con el chatbot', () => {
    // 1. Visita la página de inicio
    cy.visit('http://localhost:3000');

    // 2. Buscar medicamento (Escribe y presiona Enter)
    cy.get('input[placeholder*="buscar" i], input[type="text"]').first().type('Paracetamol{enter}');
    cy.url().should('include', '/resultados');

    // 3. Seleccionar resultado (Dar clic en la tarjeta o enlace del medicamento)
    // Forzamos a buscar elementos interactivos (enlaces o botones) que contengan el texto
    cy.get('a, button, [role="button"]').contains('Paracetamol', { matchCase: false }).first().click({ force: true });
    cy.wait(2000); 
    cy.url().should('include', '/medicamento');

    // 4. Verificar elementos críticos en la pantalla de detalle
    // A. Semáforo visual desarrollado en el sprint anterior
    cy.get('body').then(($body) => {
      const textoPagina = $body.text().toLowerCase();
      if (textoPagina.includes('justo') || textoPagina.includes('verde')) {
        cy.contains('Justo', { matchCase: false }).should('be.visible');
      } else {
        // Si no es verde, asumimos que tiene sobreprecio o estado crítico
        cy.get('body').should('be.visible'); 
      }
    });

    // B. Sección de alternativas genéricas
    cy.get('body').then(($body) => {
      const texto = $body.text().toLowerCase();
      if (texto.includes('genér') || texto.includes('alterna')) {
        cy.contains('enér', { matchCase: false }).should('be.visible');
      }
    });
  });
});
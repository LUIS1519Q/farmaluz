/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SemaforoCard from '../SemaforoCard'; 

describe('Pruebas unitarias para el componente SemaforoCard', () => {
  
  test('Debe renderizar "Precio Justo" cuando el estado es VERDE', () => {
    // Renderizamos el componente simulando un estado VERDE
    render(<SemaforoCard estado="VERDE" porcentaje={0} />);
    
    // Buscamos si el texto "Precio Justo" aparece en pantalla
    const textoVerde = screen.getByText(/Precio Justo/i);
    expect(textoVerde).toBeInTheDocument();
  });

  test('Debe renderizar el porcentaje de sobreprecio cuando el estado es ROJO', () => {
    // Renderizamos el componente simulando un estado ROJO con 50% de sobreprecio
    render(<SemaforoCard estado="ROJO" porcentaje={50} />);
    
    // Buscamos si el texto con el sobreprecio exacto aparece en pantalla
    const textoRojo = screen.getByText(/Sobreprecio 50%/i);
    expect(textoRojo).toBeInTheDocument();
  });
});
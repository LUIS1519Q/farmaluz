'use client';

import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col">
      {/* Barra de Navegación */}
      <Navbar />

      {/* Contenido Principal: Buscador Centrado */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="max-w-xl w-full text-center space-y-6">
          
          {/* Título Principal (32px Bold) */}
          <h1 className="text-[32px] font-bold text-azulOscuro tracking-tight leading-tight">
            FarmaLuz
          </h1>
          
          {/* Subtítulo / Descripción (16px Regular) */}
          <p className="text-[16px] text-[#1A1A1A]/80 font-normal">
            Plataforma web para comparar precios de medicamentos contra los precios techo legales en Ecuador.
          </p>

          {/* Componente de la Barra de Búsqueda */}
          <div className="w-full pt-2">
            <SearchBar />
          </div>
          
        </div>
      </main>

      {/* Pie de página aclaratorio (11px Regular Caption) */}
      <footer className="py-4 text-center text-[11px] font-normal text-[#1A1A1A]/60 bg-[#F2F2F2]">
        Fuente oficial de precios techo: CNFRPM / ARCSA Ecuador
      </footer>
    </div>
  );
}
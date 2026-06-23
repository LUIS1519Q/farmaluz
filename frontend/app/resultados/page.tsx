'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import SemaforoCard from '../components/SemaforoCard';
import medicamentos from '../../data/mockMedicamentos.json';

export default function Resultados() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Filtramos el JSON simulado buscando coincidencias en nombre o principio activo
  const medicamentosFiltrados = medicamentos.filter(med => 
    med.nombre_comercial.toLowerCase().includes(query) || 
    med.principio_activo.toLowerCase().includes(query)
  );

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        <h2 className="text-[24px] font-semibold text-azulOscuro mb-6">
          {query ? `Resultados para "${query}"` : 'Todos los resultados'}
        </h2>

        {medicamentosFiltrados.length === 0 ? (
          <p className="text-center text-[#1A1A1A]/70 mt-10">No se encontraron medicamentos para esta búsqueda.</p>
        ) : (
          <div className="flex flex-col space-y-4">
            {medicamentosFiltrados.map((med) => (
              <Link href={`/medicamento/${med.id}`} key={med.id}>
                <div className="bg-white rounded-lg p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-azulClaro/20 transition-colors cursor-pointer border border-transparent hover:border-azulClaro">
                  
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-[20px] font-bold text-[#1A1A1A]">{med.nombre_comercial}</h3>
                    <p className="text-[16px] text-[#1A1A1A]/70">{med.principio_activo} • {med.concentracion}</p>
                    
                    <div className="mt-3 text-[14px] flex flex-col space-y-1">
                      <p>
                        <span className="font-medium text-[#1A1A1A]/60">Precio Techo Oficial:</span> 
                        <span className="ml-2 font-semibold">${med.precio_techo.toFixed(2)}</span>
                      </p>
                      <p>
                        <span className="font-medium text-[#1A1A1A]/60">Precio Cobrado:</span> 
                        <span className="ml-2 font-semibold text-azulOscuro">${med.precio_cobrado.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <SemaforoCard 
                      estado={med.estado_semaforo as "VERDE" | "ROJO"} 
                      porcentaje={med.porcentaje_sobreprecio} 
                    />
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
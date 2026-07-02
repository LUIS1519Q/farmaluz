'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import SemaforoCard from '../components/SemaforoCard';
import { api } from '../../lib/api';
// Mantenemos el mock importado temporalmente para el fallback del semáforo si es necesario
import mockMedicamentos from '../../data/mockMedicamentos.json';

// Definimos la interfaz basada en lo que devuelve el backend
interface Medicamento {
  id: string;
  nombre_comercial: string;
  principio_activo: string;
  concentracion: string;
  precio_techo: number;
  precio_cobrado: number;
  estado_semaforo: string;
  porcentaje_sobreprecio: number;
}

function ResultadosContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        setLoading(true);
        // Llamada a la API real
        const response = await api.get('/medicamentos/');
        const dataReal = response.data;
        
        // Filtramos los resultados según la búsqueda
        const filtrados = dataReal.filter((med: any) => {
          const nombreSeguro = (med.nombre_comercial || med.nombre || med["Principio Activo"] || "").toLowerCase();
          const principioSeguro = (med.principio_activo || "").toLowerCase();
          
          return nombreSeguro.includes(query) || principioSeguro.includes(query);
        });
        
        setMedicamentos(filtrados);
      } catch (error) {
        console.error("Error cargando medicamentos de la API:", error);
        // Si la API falla, usamos el mock como contingencia para no romper la pantalla
        const filtradosMock = mockMedicamentos.filter(med => 
          med.nombre_comercial.toLowerCase().includes(query) || 
          med.principio_activo.toLowerCase().includes(query)
        );
        setMedicamentos(filtradosMock as Medicamento[]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [query]);

  return (
    <>
      <h2 className="text-[24px] font-semibold text-azulOscuro mb-6">
        {query ? `Resultados para "${query}"` : 'Todos los resultados'}
      </h2>

      {loading ? (
        <div className="text-center text-azulMedio mt-10 font-medium">
          Cargando resultados desde el servidor...
        </div>
      ) : medicamentos.length === 0 ? (
        <p className="text-center text-[#1A1A1A]/70 mt-10">No se encontraron medicamentos para esta búsqueda.</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {medicamentos.map((med: any, index: number) => {
            // 1. Normalización de textos
            const idSeguro = med.id || med._id || Math.random().toString();
            const nombre = med.nombre_comercial || med.nombre || med["Principio Activo"] || "Medicamento sin nombre";
            const principio = med.principio_activo || med["Principio Activo"] || "";
            const concentracion = med.concentracion || med["Concentración"] || "";

            // 2. Función robusta para limpiar precios (quita símbolos "$" y letras, dejando solo el número)
            const limpiarPrecio = (precioRaw: any) => {
              if (!precioRaw) return 0;
              if (typeof precioRaw === 'number') return precioRaw;
              // Extrae solo los números y el punto decimal
              const numeroLimpio = Number(precioRaw.toString().replace(/[^0-9.-]+/g, ""));
              return isNaN(numeroLimpio) ? 0 : numeroLimpio;
            };

            // 3. Extracción de precios y semáforo adaptados al backend
            const precioTecho = limpiarPrecio(med.precio_techo || med["Precio Techo"]);
            // Usamos 0 como fallback temporal si el scraper aún no ha guardado el precio_cobrado
            const precioCobrado = limpiarPrecio(med.precio_cobrado || med["Precio Cobrado"] || 0); 
            
            const estadoSemaforo = med.estado_semaforo || med.estado || med.semaforo?.estado || "VERDE";
            const porcentaje = med.porcentaje_sobreprecio || med.porcentaje || med.semaforo?.porcentaje || 0;

            return (
              <Link href={`/medicamento/${idSeguro}`} key={`${idSeguro}-${index}`}>
                <div className="bg-white rounded-lg p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-azulClaro/20 transition-colors cursor-pointer border border-transparent hover:border-azulClaro">
                  
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-[20px] font-bold text-[#1A1A1A]">{nombre}</h3>
                    <p className="text-[16px] text-[#1A1A1A]/70">{principio} {concentracion ? `• ${concentracion}` : ''}</p>
                    
                    <div className="mt-3 text-[14px] flex flex-col space-y-1">
                      <p>
                        <span className="font-medium text-[#1A1A1A]/60">Precio Techo Oficial:</span> 
                        <span className="ml-2 font-semibold">${precioTecho.toFixed(2)}</span>
                      </p>
                      <p>
                        <span className="font-medium text-[#1A1A1A]/60">Precio Cobrado:</span> 
                        <span className="ml-2 font-semibold text-azulOscuro">${precioCobrado.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <SemaforoCard 
                      estado={estadoSemaforo as "VERDE" | "ROJO"} 
                      porcentaje={porcentaje} 
                    />
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function Resultados() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        <Suspense fallback={
          <div className="text-center text-azulMedio mt-10 font-medium">
            Cargando resultados...
          </div>
        }>
          <ResultadosContent />
        </Suspense>
      </main>
    </div>
  );
}
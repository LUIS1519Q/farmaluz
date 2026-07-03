'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import SemaforoCard from '../components/SemaforoCard';
import { api } from '../../lib/api';

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
        const response = await api.get('/medicamentos/');
        const dataReal = response.data;

        const filtrados = dataReal.filter((med: any) => {
          const nombreSeguro = (med["Principio Activo"] || "").toLowerCase();
          return nombreSeguro.includes(query);
        });

        const conPrecios = await Promise.all(
          filtrados.slice(0, 20).map(async (med: any) => {
            try {
              const comp = await api.get(`/comparacion/${med._id}`);
              return {
                ...med,
                precio_techo: comp.data.precio_techo,
                precio_cobrado: comp.data.precio_cobrado,
                estado_semaforo: comp.data.semaforo?.estado || "VERDE",
                porcentaje_sobreprecio: comp.data.semaforo?.porcentaje || 0,
              };
            } catch {
              return {
                ...med,
                precio_techo: 0,
                precio_cobrado: 0,
                estado_semaforo: "VERDE",
                porcentaje_sobreprecio: 0,
              };
            }
          })
        );

        setMedicamentos(conPrecios);
      } catch (error) {
        console.error("Error cargando medicamentos de la API:", error);
        setMedicamentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [query]);

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

        {loading ? (
          <div className="text-center text-azulMedio mt-10 font-medium">
            Cargando resultados desde el servidor...
          </div>
        ) : medicamentos.length === 0 ? (
          <p className="text-center text-[#1A1A1A]/70 mt-10">No se encontraron medicamentos para esta búsqueda.</p>
        ) : (
          <div className="flex flex-col space-y-4">
            {medicamentos.map((med: any, index: number) => {
              const idSeguro = med._id || med.id || Math.random().toString();
              const nombre = med["Principio Activo"] || med.nombre_comercial || "Medicamento sin nombre";
              const principio = med["Principio Activo"] || "";
              const concentracion = med["Concentración "] || med.concentracion || "";

              const precioTecho = med.precio_techo || 0;
              const precioCobrado = med.precio_cobrado || 0;
              const estadoSemaforo = med.estado_semaforo || "VERDE";
              const porcentaje = med.porcentaje_sobreprecio || 0;

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
      </main>
    </div>
  );
}

export default function Resultados() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
        <p className="text-azulMedio font-medium">Cargando...</p>
      </div>
    }>
      <ResultadosContent />
    </Suspense>
  );
}
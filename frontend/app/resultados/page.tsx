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
  const [letraFiltro, setLetraFiltro] = useState<string | null>(null);

  // Generamos el alfabeto para el filtro
  const letras = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

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
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-10 flex flex-col">
        {/* Barra de búsqueda superior y Título */}
        <div className="w-full max-w-4xl mx-auto mb-10 text-center">
          <div className="mb-8">
            <SearchBar />
          </div>
          <h1 className="text-[40px] font-extrabold text-azulOscuro tracking-tight">
            Resultados para {query ? `"${query}"` : 'todos'}
          </h1>
        </div>

        {/* Layout de dos columnas: Filtro y Grilla */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar: Filtro Alfabético */}
          <aside className="w-full md:w-48 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-semibold text-gray-700 mb-4 leading-tight">
                Filtrar por letra<br/>(A-Z)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {letras.map((letra) => (
                  <button
                    key={letra}
                    onClick={() => setLetraFiltro(letraFiltro === letra ? null : letra)}
                    className={`w-10 h-10 rounded-lg font-bold transition-colors flex items-center justify-center text-sm ${
                      letraFiltro === letra 
                        ? 'bg-azulMedio text-white shadow-md' 
                        : 'bg-blue-100 text-azulOscuro hover:bg-azulMedio hover:text-white'
                    }`}
                  >
                    {letra}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grilla de Resultados */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center text-azulMedio mt-10 font-medium">
                Cargando resultados desde el servidor...
              </div>
            ) : medicamentos.length === 0 ? (
              <p className="text-center text-[#1A1A1A]/70 mt-10">No se encontraron medicamentos para esta búsqueda.</p>
            ) : (() => {
              const medicamentosMostrados = letraFiltro 
                ? medicamentos.filter(med => {
                    const nombre = (med as any)["Principio Activo"] || med.nombre_comercial || "Medicamento";
                    return nombre.toUpperCase().startsWith(letraFiltro);
                  })
                : medicamentos;

              if (medicamentosMostrados.length === 0) {
                return <p className="text-center text-[#1A1A1A]/70 mt-10">No hay medicamentos que empiecen con la letra {letraFiltro}.</p>;
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {medicamentosMostrados.map((med: any, index: number) => {
                    const idSeguro = med._id || med.id || Math.random().toString();
                    const nombre = med["Principio Activo"] || med.nombre_comercial || "Medicamento sin nombre";
                    const principio = med["Principio Activo"] || "";
                    const concentracion = med["Concentración "] || med.concentracion || "";
                    const estadoSemaforo = med.estado_semaforo || "VERDE";
                    const porcentaje = med.porcentaje_sobreprecio || 0;

                    return (
                      <Link href={`/medicamento/${idSeguro}`} key={`${idSeguro}-${index}`} className="block h-full">
                        <div className="bg-white rounded-[16px] p-5 shadow-md hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col justify-between hover:-translate-y-1">
                          
                          <div className="mb-4">
                            <h3 className="text-[17px] font-bold text-[#1A1A1A] leading-tight mb-2 uppercase">
                              {nombre} {concentracion}
                            </h3>
                            <p className="text-[13px] text-gray-500">
                              Principio activo: <span className="capitalize">{principio.toLowerCase()}</span>
                            </p>
                          </div>

                          <div className="mt-auto">
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
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Resultados() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <p className="text-azulMedio font-medium">Cargando...</p>
      </div>
    }>
      <ResultadosContent />
    </Suspense>
  );
}
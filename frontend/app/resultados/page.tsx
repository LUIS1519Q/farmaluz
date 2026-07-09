'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [todosLosFiltrados, setTodosLosFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [letraFiltro, setLetraFiltro] = useState<string | null>(searchParams.get('letra') || null);
  const [farmaciaFiltro, setFarmaciaFiltro] = useState<string>(searchParams.get('farmacia') || 'Todas');

  const BATCH_SIZE = 20;

  // Sincronizar filtros con la URL para que persistan al navegar
  const actualizarFiltroURL = (farmacia: string, letra: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (farmacia !== 'Todas') params.set('farmacia', farmacia);
    else params.delete('farmacia');
    if (letra) params.set('letra', letra);
    else params.delete('letra');
    router.replace(`/resultados?${params.toString()}`, { scroll: false });
  };

  const handleFarmaciaChange = (farm: string) => {
    setFarmaciaFiltro(farm);
    actualizarFiltroURL(farm, letraFiltro);
  };

  const handleLetraChange = (letra: string) => {
    const nuevaLetra = letraFiltro === letra ? null : letra;
    setLetraFiltro(nuevaLetra);
    actualizarFiltroURL(farmaciaFiltro, nuevaLetra);
  };

  // Generamos el alfabeto para el filtro
  const letras = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  // Función reutilizable para cargar precios de un lote de medicamentos
  const cargarPrecios = async (lote: any[], farmaciaParams: any = {}): Promise<Medicamento[]> => {
    const conPrecios = await Promise.all(
      lote.map(async (med: any) => {
        try {
          const comp = await api.get(`/comparacion/${med._id}`, { params: farmaciaParams });
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

    // Ocultar medicamentos sin precios reales ($0.00)
    return conPrecios.filter(
      (med) => med.precio_cobrado !== 0 || med.precio_techo !== 0
    );
  };

  // Carga inicial: obtener lista completa y cargar primer lote
  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        setLoading(true);
        setMedicamentos([]);
        setTodosLosFiltrados([]);

        let dataReal: any[] = [];

        if (farmaciaFiltro !== 'Todas') {
          const response = await api.get(`/medicamentos/con-precio`, {
            params: { farmacia: farmaciaFiltro }
          });
          dataReal = response.data;
        } else {
          const response = await api.get('/medicamentos/');
          dataReal = response.data;
        }

        const filtrados = dataReal.filter((med: any) => {
          const nombreSeguro = (med["Principio Activo"] || "").toLowerCase();
          return nombreSeguro.includes(query);
        });

        setTodosLosFiltrados(filtrados);

        // Configurar params para comparacion si hay filtro
        const farmaciaParams = farmaciaFiltro !== 'Todas' ? { farmacia: farmaciaFiltro } : {};

        // Cargar primer lote
        const primerLote = filtrados.slice(0, BATCH_SIZE);
        const conPrecios = await cargarPrecios(primerLote, farmaciaParams);
        setMedicamentos(conPrecios);
      } catch (error) {
        console.error("Error cargando medicamentos de la API:", error);
        setMedicamentos([]);
        setTodosLosFiltrados([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicamentos();
  }, [query, farmaciaFiltro]);

  // Cargar siguiente lote
  const cargarMas = async () => {
    try {
      setLoadingMore(true);
      const desde = medicamentos.length;
      // Necesitamos contar cuántos del total ya procesamos, no cuántos mostramos
      // (algunos se ocultan por $0.00). Usamos un offset basado en lotes procesados.
      const lotesYaProcesados = Math.ceil(desde / BATCH_SIZE) * BATCH_SIZE;
      // Tomamos un lote un poco más grande para compensar los filtrados por $0
      const siguienteLote = todosLosFiltrados.slice(lotesYaProcesados, lotesYaProcesados + BATCH_SIZE);

      if (siguienteLote.length === 0) return;

      // Configurar params para comparacion si hay filtro
      const farmaciaParams = farmaciaFiltro !== 'Todas' ? { farmacia: farmaciaFiltro } : {};

      const nuevosConPrecios = await cargarPrecios(siguienteLote, farmaciaParams);
      setMedicamentos(prev => [...prev, ...nuevosConPrecios]);
    } catch (error) {
      console.error("Error cargando más medicamentos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Calcular cuántos quedan por cargar
  const totalFiltrados = todosLosFiltrados.length;
  const lotesProcesados = medicamentos.length > 0
    ? Math.ceil(medicamentos.length / BATCH_SIZE) * BATCH_SIZE
    : 0;
  const hayMas = lotesProcesados < totalFiltrados;

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
          {!loading && (
            <p className="text-sm text-gray-500 mt-2">
              Mostrando {medicamentos.length} de {totalFiltrados} medicamentos
            </p>
          )}
        </div>

        {/* Layout de dos columnas: Filtro y Grilla */}
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar: Filtros */}
          <aside className="w-full md:w-48 flex-shrink-0">
            <div className="sticky top-24">
              {/* Filtro por farmacia */}
              <h3 className="font-semibold text-gray-700 mb-3 leading-tight">
                Filtrar por farmacia
              </h3>
              <div className="flex flex-col gap-2 mb-6">
                {['Todas', 'Fybeca', 'Cruz Azul'].map((farm) => (
                  <button
                    key={farm}
                    onClick={() => handleFarmaciaChange(farm)}
                    className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      farmaciaFiltro === farm
                        ? 'bg-azulMedio text-white shadow-md'
                        : 'bg-blue-100 text-azulOscuro hover:bg-azulMedio hover:text-white'
                    }`}
                  >
                    {farm}
                  </button>
                ))}
              </div>

              {/* Filtro por letra */}
              <h3 className="font-semibold text-gray-700 mb-3 leading-tight">
                Filtrar por letra<br/>(A-Z)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {letras.map((letra) => (
                  <button
                    key={letra}
                    onClick={() => handleLetraChange(letra)}
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
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {medicamentosMostrados.map((med: any, index: number) => {
                      const idSeguro = med._id || med.id || Math.random().toString();
                      const nombre = med["Principio Activo"] || med.nombre_comercial || "Medicamento sin nombre";
                      const principio = med["Principio Activo"] || "";
                      const concentracion = med["Concentración "] || med.concentracion || "";
                      const estadoSemaforo = med.estado_semaforo || "VERDE";
                      const porcentaje = med.porcentaje_sobreprecio || 0;

                      return (
                        <Link href={`/medicamento/${idSeguro}${farmaciaFiltro !== 'Todas' ? `?farmacia=${encodeURIComponent(farmaciaFiltro)}` : ''}`} key={`${idSeguro}-${index}`} className="block h-full">
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

                  {/* Botón Cargar más */}
                  {hayMas && !letraFiltro && (
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={cargarMas}
                        disabled={loadingMore}
                        className="bg-azulMedio text-white font-bold text-[15px] px-8 py-3.5 rounded-xl shadow hover:bg-azulOscuro hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {loadingMore ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Cargando...
                          </span>
                        ) : (
                          `Cargar más medicamentos (${totalFiltrados - lotesProcesados} restantes)`
                        )}
                      </button>
                    </div>
                  )}
                </>
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
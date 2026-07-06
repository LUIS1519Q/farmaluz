'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Pill, ClipboardList, AlertTriangle, Store } from 'lucide-react';
import { api } from '../../lib/api';

interface Stats {
  total_medicamentos?: number;
  total_consultas?: number;
  porcentaje_sobreprecio?: number;
  farmacias_activas?: number;
  total_fybeca?: number;
  total_cruzazul?: number;
}

interface TopMedicamento {
  nombre: string;
  consultas: number;
}

interface Consulta {
  _id?: string;
  medicamento_id?: string;
  nombre: string;
  farmacia: string;
  precio_cobrado: number;
  precio_techo: number;
  estado_semaforo: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topMedicamentos, setTopMedicamentos] = useState<TopMedicamento[]>([]);
  const [ultimasConsultas, setUltimasConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Ejecutamos las 3 llamadas en paralelo
        const [statsRes, topRes, ultimasRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/top-medicamentos'),
          api.get('/dashboard/ultimas-consultas')
        ]);

        setStats(statsRes.data);
        
        // Manejamos el array del Top (puede venir directo o dentro de un objeto)
        setTopMedicamentos(Array.isArray(topRes.data) ? topRes.data : topRes.data.data || []);
        
        // Manejamos el array de Últimas consultas
        setUltimasConsultas(Array.isArray(ultimasRes.data) ? ultimasRes.data : ultimasRes.data.data || []);

      } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Funciones auxiliares para gráficas
  const maxTopValue = topMedicamentos.length > 0 ? Math.max(...topMedicamentos.map(m => m.consultas || 0)) : 100;
  
  const totalPorFarmacia = (stats?.total_fybeca || 0) + (stats?.total_cruzazul || 0);
  const pctCruzAzul = totalPorFarmacia > 0 ? Math.round(((stats?.total_cruzazul || 0) / totalPorFarmacia) * 100) : 50;
  const pctFybeca = totalPorFarmacia > 0 ? 100 - pctCruzAzul : 50;

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-azulMedio border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-medium text-azulMedio">Cargando métricas del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
        
        <h1 className="text-3xl font-bold text-azulOscuro mb-8">Dashboard de Monitoreo</h1>

        {/* Tarjetas KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-azulMedio flex-shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-azulOscuro leading-none mb-1">
                {stats?.total_medicamentos?.toLocaleString() || 0}
              </h3>
              <p className="text-[11px] text-gray-500 leading-tight uppercase font-medium">Medicamentos<br/>Monitoreados</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-verdeSemaforo flex-shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-azulOscuro leading-none mb-1">
                {stats?.total_consultas?.toLocaleString() || 0}
              </h3>
              <p className="text-[11px] text-gray-500 leading-tight uppercase font-medium">Consultas<br/>Registradas</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl text-rojoSemaforo flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-rojoSemaforo leading-none mb-1">
                {stats?.porcentaje_sobreprecio?.toFixed(1) || 0}%
              </h3>
              <p className="text-[11px] text-gray-500 leading-tight uppercase font-medium">Consultas con<br/>Sobreprecio</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-azulMedio flex-shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-azulOscuro leading-none mb-1">
                {stats?.farmacias_activas || 0}
              </h3>
              <p className="text-[11px] text-gray-500 leading-tight uppercase font-medium">Farmacias<br/>Activas</p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* Top Medicamentos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1A1A1A] mb-6">Top 5 medicamentos más consultados</h3>
            
            <div className="space-y-4">
              {topMedicamentos.length > 0 ? topMedicamentos.slice(0,5).map((item, index) => {
                const widthPct = maxTopValue > 0 ? (item.consultas / maxTopValue) * 100 : 0;
                return (
                  <div key={index} className="flex items-center text-sm">
                    <span className="w-32 text-gray-600 truncate mr-3 font-medium" title={item.nombre}>{item.nombre || 'Desconocido'}</span>
                    <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden border border-gray-100 relative">
                      <div 
                        className="h-full bg-azulMedio rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.max(widthPct, 2)}%` }}
                      ></div>
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white z-10 mix-blend-difference">{item.consultas}</span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-gray-400 italic">No hay datos de consultas aún.</p>
              )}
            </div>
          </div>

          {/* Consultas por Farmacia */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-bold text-[#1A1A1A] mb-6">Precios extraídos por Farmacia</h3>
            
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-10">
              {/* Gráfico de Pastel CSS */}
              <div className="relative w-40 h-40 rounded-full border-[8px] border-gray-50 shadow-inner flex items-center justify-center"
                   style={{ background: `conic-gradient(var(--color-verdeSemaforo) 0% ${pctCruzAzul}%, var(--color-azulMedio) ${pctCruzAzul}% 100%)` }}>
                <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-xl font-bold text-azulOscuro">{totalPorFarmacia}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Total</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-verdeSemaforo shadow-sm"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Cruz Azul</p>
                    <p className="text-xs text-gray-500">{stats?.total_cruzazul || 0} precios ({pctCruzAzul}%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-azulMedio shadow-sm"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Fybeca</p>
                    <p className="text-xs text-gray-500">{stats?.total_fybeca || 0} precios ({pctFybeca}%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla Últimas Consultas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1A1A1A] mb-4">Últimas consultas registradas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-gray-400 border-b-2 border-gray-100 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">Medicamento</th>
                  <th className="px-4 py-3 font-semibold">Farmacia</th>
                  <th className="px-4 py-3 font-semibold">Precio Techo</th>
                  <th className="px-4 py-3 font-semibold">Precio Cobrado</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-lg">Semáforo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ultimasConsultas.length > 0 ? ultimasConsultas.map((consulta, idx) => {
                  const esRojo = consulta.estado_semaforo === 'ROJO';
                  return (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-800 uppercase text-xs">{consulta.nombre || 'Desconocido'}</td>
                      <td className="px-4 py-4 text-gray-600 font-medium">{consulta.farmacia || 'N/A'}</td>
                      <td className="px-4 py-4 text-gray-500 font-medium">${(consulta.precio_techo || 0).toFixed(2)}</td>
                      <td className="px-4 py-4 text-azulOscuro font-bold">${(consulta.precio_cobrado || 0).toFixed(2)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center shadow-sm ${esRojo ? 'bg-rojoSemaforo text-white' : 'bg-verdeSemaforo text-white'}`}>
                          {esRojo ? '⚠ Sobreprecio' : '✓ Precio Justo'}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">No hay consultas registradas todavía.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

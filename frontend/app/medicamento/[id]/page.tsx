'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import SemaforoCard from '../../components/SemaforoCard';
import { api } from '../../../lib/api';

interface DetalleMedicamento {
  id?: string;
  nombre_comercial?: string;
  nombre?: string;
  principio_activo?: string;
  concentracion?: string;
  precio_techo?: number | string;
  precio_cobrado?: number | string;
  semaforo?: {
    estado: string;
    porcentaje: number;
  };
  ultima_actualizacion?: string;
  [key: string]: any; // Permite leer llaves dinámicas del backend si cambian
}

export default function DetalleMedicamento() {
  const params = useParams();
  const id = params.id as string;

  const [med, setMed] = useState<DetalleMedicamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("No pudimos conectar con el servidor.");

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        setError(false);

        // 1. Petición de precios (Si da 404, manejamos la vista amigable sin romper Next.js)
        let compData = null;
        try {
          const compResponse = await api.get(`/comparacion/${id}`);
          compData = compResponse.data;
        } catch (err: any) {
          setError(true);
          if (err.response && err.response.status === 404) {
            setMensajeError("Este medicamento aún no tiene precios registrados en la base de datos.");
          } else {
            setMensajeError("No pudimos conectar con el servidor.");
          }
          setLoading(false);
          return; // Detiene la ejecución para que no intente buscar el nombre de algo que no existe
        }

        // 2. Petición de información básica (Nombres y Principio Activo)
        let infoData = {};
        try {
          const infoResponse = await api.get(`/medicamentos/${id}`);
          infoData = infoResponse.data.data || infoResponse.data.medicamento || infoResponse.data;
          if (Array.isArray(infoData)) infoData = infoData[0]; // Por si el backend responde una lista
        } catch (err) {
          console.warn("No se pudo cargar el nombre del medicamento desde la API");
        }

        // 3. Fusionamos la información en el estado
        setMed({
          ...infoData,
          ...compData
        });

      } catch (err) {
        console.error("Error crítico en el flujo:", err);
        setError(true);
        setMensajeError("Ocurrió un error inesperado al procesar los datos.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetalle();
  }, [id]);

  // Pantalla de Carga (Loading)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-azulMedio border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-medium text-azulMedio">Consultando precios...</p>
        </div>
      </div>
    );
  }

  // Pantalla de Error Controlada (Evita la pantalla roja de Next.js)
  if (error || !med) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-rojoSemaforo mb-4">¡Ups! Algo salió mal</h1>
          <p className="text-lg text-[#1A1A1A]/70 max-w-md mb-8">{mensajeError}</p>
          <Link href="/resultados">
            <button className="bg-azulMedio text-white px-6 py-3 rounded-lg hover:bg-azulOscuro transition-colors">
              Volver a resultados
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Extracción segura de valores numéricos para evitar caídas por strings o nulos
  const limpiarPrecio = (precioRaw: any) => {
    if (!precioRaw) return 0;
    if (typeof precioRaw === 'number') return precioRaw;
    const numeroLimpio = Number(precioRaw.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(numeroLimpio) ? 0 : numeroLimpio; // <--- Aquí estaba el error
  };

  const precioTecho = limpiarPrecio(med.precio_techo || med["Precio Techo"]);
  const precioCobrado = limpiarPrecio(med.precio_cobrado || med["Precio Cobrado"]);
  const estadoSemaforo = med.semaforo?.estado || med.estado || "VERDE";
  const porcentaje = med.semaforo?.porcentaje || med.porcentaje || 0;

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8 shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border border-transparent hover:border-azulClaro transition-colors">
          
          <Link href="/resultados" className="inline-block mb-6 text-azulMedio hover:text-azulOscuro font-medium text-sm">
            ← Volver a resultados
          </Link>

          {/* TITULO DINÁMICO SEGURO */}
          <h1 className="text-[32px] font-bold text-azulOscuro mb-2">
            {med.nombre_comercial || med.nombre || med["Principio Activo"] || "Detalle del Medicamento"}
          </h1>
          
          {/* SUBTÍTULO SEGURO (El punto solo aparece si hay concentración) */}
          <p className="text-[24px] font-semibold text-[#1A1A1A]/70 mb-8 border-b pb-6">
            {med.principio_activo || med["Principio Activo"] || "Información base"} 
            {(med.concentracion || med["Concentración"]) ? ` • ${med.concentracion || med["Concentración"]}` : ""}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="space-y-4 text-[16px] mb-6 sm:mb-0">
              <div className="flex items-center space-x-3">
                <span className="text-[#1A1A1A]/60">Precio Techo Oficial:</span>
                <span className="font-semibold">${precioTecho.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#1A1A1A]/60">Precio en Farmacia:</span>
                <span className="font-semibold text-azulOscuro text-[20px]">${precioCobrado.toFixed(2)}</span>
              </div>
              
              {med.ultima_actualizacion && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500 italic bg-gray-50 px-3 py-1 rounded-full">
                    ⏱ Actualizado: {med.ultima_actualizacion}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 scale-110 sm:scale-125 transform origin-left sm:origin-right mt-4 sm:mt-0">
              <SemaforoCard estado={estadoSemaforo as "VERDE" | "ROJO"} porcentaje={porcentaje} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
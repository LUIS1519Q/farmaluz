'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import SemaforoCard from '../../components/SemaforoCard';
import { api } from '../../../lib/api';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

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
  [key: string]: any;
}

export default function DetalleMedicamento() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const farmacia = searchParams.get('farmacia');

  const [med, setMed] = useState<DetalleMedicamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("No pudimos conectar con el servidor.");

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        setError(false);

        let compData: any = {};
        try {
          const compParams = farmacia ? { farmacia } : {};
          const compResponse = await api.get(`/comparacion/${id}`, { params: compParams });
          compData = compResponse.data;
        } catch (err: any) {
          if (err.response && err.response.status === 404) {
            console.warn("Este medicamento aún no tiene precios registrados en la base de datos.");
            // No detenemos el flujo, dejamos compData vacío y continuamos
          } else {
            setError(true);
            setMensajeError("No pudimos conectar con el servidor.");
            setLoading(false);
            return; 
          }
        }

        let infoData: any = {};
        try {
          const infoResponse = await api.get(`/medicamentos/${id}`);
          infoData = infoResponse.data.data || infoResponse.data.medicamento || infoResponse.data;
          if (Array.isArray(infoData)) infoData = infoData[0]; 
        } catch (err) {
          console.warn("No se pudo cargar el nombre del medicamento desde la API");
        }

        const normalizarPrecio = (precioRaw: any) => {
          if (!precioRaw) return 0.0;
          if (typeof precioRaw === 'number') return precioRaw;
          const numeroLimpio = Number(precioRaw.toString().replace(/[^0-9.-]+/g, ""));
          return isNaN(numeroLimpio) ? 0.0 : numeroLimpio;
        };

        const datosUnificados = {
          ...infoData,
          ...compData
        };
        setMed(datosUnificados);

        try {
          const payloadAuditoria = {
            medicamento_id: String(id),
            nombre: String(infoData.nombre_comercial || infoData.nombre || infoData["Principio Activo"] || "Medicamento Sin Nombre"),
            precio_techo: normalizarPrecio(compData.precio_techo || compData["Precio Techo"]),
            precio_cobrado: normalizarPrecio(compData.precio_cobrado || compData["Precio Cobrado"]),
            estado_semaforo: String(compData.semaforo?.estado || compData.estado || "VERDE"),
            porcentaje: normalizarPrecio(compData.semaforo?.porcentaje || compData.porcentaje),
            farmacia: String(compData.farmacia || infoData.farmacia || "Fybeca") 
          };

          api.post('/auditoria', payloadAuditoria)
            .then(res => console.log("Auditoría registrada:", res.data.mensaje))
            .catch(err => console.warn("Error al registrar auditoría en el servidor:", err));

        } catch (auditErr) {
          console.warn("Error al estructurar el payload de auditoría:", auditErr);
        }

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-azulMedio border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-medium text-azulMedio">Consultando precios...</p>
        </div>
      </div>
    );
  }

  if (error || !med) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent">
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

  const limpiarPrecio = (precioRaw: any) => {
    if (!precioRaw) return 0;
    if (typeof precioRaw === 'number') return precioRaw;
    const numeroLimpio = Number(precioRaw.toString().replace(/[^0-9.-]+/g, ""));
    return isNaN(numeroLimpio) ? 0 : numeroLimpio;
  };

  const precioTecho = limpiarPrecio(med.precio_techo || med["Precio Techo"]);
  const precioCobrado = limpiarPrecio(med.precio_cobrado || med["Precio Cobrado"]);
  const estadoSemaforo = med.semaforo?.estado || med.estado || "VERDE";
  const porcentaje = med.semaforo?.porcentaje || med.porcentaje || 0;
  
  const nombrePrincipal = med.nombre_comercial || med.nombre || med["Principio Activo"] || "MEDICAMENTO";
  const principio = med.principio_activo || med["Principio Activo"] || "";
  const concentracion = med.concentracion || med["Concentración"] || "";

  return (
    <div className="min-h-screen text-[#1A1A1A] flex flex-col bg-transparent">
      <Navbar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        
        {/* Enlace de regreso afuera de la tarjeta */}
        <button onClick={() => router.back()} className="inline-flex items-center mb-6 text-azulOscuro hover:text-azulMedio font-semibold text-[15px] transition-colors">
          <span className="mr-2">←</span> Volver a resultados
        </button>

        {/* Tarjeta Blanca Principal */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 max-w-2xl mx-auto">
          
          <h1 className="text-[32px] md:text-[36px] font-extrabold text-azulOscuro mb-1 uppercase tracking-tight">
            {nombrePrincipal}
          </h1>
          
          <p className="text-[18px] text-gray-500 mb-6 uppercase">
            {principio} {(principio && concentracion) ? '•' : ''} {concentracion}
          </p>
          
          <hr className="border-gray-200 mb-6" />
          
          {/* Bloque de Precios y Semáforo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">
            <div className="space-y-2 text-[16px]">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium w-40">Precio Techo Oficial:</span>
                <span className="font-bold text-gray-800">${precioTecho.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium w-40">Precio en Farmacia:</span>
                <span className="font-bold text-azulOscuro text-[18px]">${precioCobrado.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium w-40">Precio Promedio:</span>
                <span className="font-bold text-gray-700">${((precioTecho + precioCobrado) / 2).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex-shrink-0 scale-110 origin-left sm:origin-right">
              <SemaforoCard estado={estadoSemaforo as "VERDE" | "ROJO"} porcentaje={porcentaje} />
            </div>
          </div>
          
          <hr className="border-gray-200 mb-6" />

          {/* Información de Farmacia */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center text-azulMedio relative">
                {med.farmacia === "Cruz Azul" ? (
                  <Image src="/assets/logo-cruz-azul.png" alt="Cruz Azul" fill sizes="24px" className="object-contain" />
                ) : med.farmacia === "Fybeca" ? (
                  <Image src="/assets/logo-fybeca.png" alt="Fybeca" fill sizes="24px" className="object-contain" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z"/>
                  </svg>
                )}
              </div>
              <span className="text-gray-700 font-medium">{med.farmacia || "Farmacia no identificada"}</span>
            </div>
            {med.url_producto && med.url_producto !== "#" ? (
              <a href={med.url_producto} target="_blank" rel="noopener noreferrer" className="text-azulMedio font-semibold text-sm hover:underline flex items-center gap-1">
                Ver producto →
              </a>
            ) : (
              <span className="text-gray-400 text-sm flex items-center gap-1 cursor-not-allowed">
                Sin enlace
              </span>
            )}
          </div>

          {med.laboratorio && med.laboratorio !== "No disponible" && (
            <div className="text-sm text-gray-500 mb-2">
              Laboratorio: <span className="text-gray-700 font-medium">{med.laboratorio}</span>
            </div>
          )}

          {med.tipo_presentacion && med.tipo_presentacion !== "No disponible" && (
            <div className="text-sm text-gray-500 mb-2">
              Presentación: <span className="text-gray-700 font-medium">{med.tipo_presentacion}</span>
            </div>
          )}

          {med.dosificacion && med.dosificacion !== "No disponible" && (
            <div className="text-sm text-gray-500 mb-2">
              Dosificación: <span className="text-gray-700 font-medium">{med.dosificacion}</span>
            </div>
          )}

          {med.fecha_elaboracion && med.fecha_elaboracion !== "No disponible" && (
            <div className="text-sm text-gray-500 mb-2">
              Fecha de elaboración: <span className="text-gray-700 font-medium">{med.fecha_elaboracion}</span>
            </div>
          )}

          {med.fecha_vencimiento && med.fecha_vencimiento !== "No disponible" && (
            <div className="text-sm text-gray-500 mb-2">
              Fecha de vencimiento: <span className="text-gray-700 font-medium">{med.fecha_vencimiento}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Calendar className="w-4 h-4" />
            <span>
              Actualizado: {med.ultima_actualizacion && med.ultima_actualizacion !== "Fecha no disponible"
                ? new Date(med.ultima_actualizacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                : "Fecha no disponible"}
            </span>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Sección Informativa */}
          <div className="mb-8">
            <h3 className="font-bold text-[18px] text-[#1A1A1A] mb-2">¿Qué significa este resultado?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              El precio cobrado {estadoSemaforo === 'ROJO' ? 'supera el precio techo legal' : 'está dentro del límite legal'}. 
              Según la normativa ecuatoriana esto {estadoSemaforo === 'ROJO' ? 'puede constituir una infracción.' : 'es correcto.'}
              {estadoSemaforo === 'ROJO' && ' Te recomendamos consultar con las autoridades competentes.'}
            </p>
          </div>

          {/* Botón Asistente IA */}
          <div className="flex justify-center">
            <Link href="/chatbot">
              <button className="bg-azulMedio text-white font-bold text-[16px] px-8 py-3.5 rounded-xl shadow hover:bg-azulOscuro hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                Consultar Asistente IA
              </button>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
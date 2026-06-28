'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { api } from '../../../lib/api';

interface Generico {
  id: string;
  nombre_comercial: string;
  principio_activo: string;
  precio: number;
  farmacia?: string;
}

export default function SugerenciaGenericos() {
  const params = useParams();
  const id = params.id as string;

  const [genericos, setGenericos] = useState<Generico[]>([]);
  const [precioOriginal, setPrecioOriginal] = useState<number>(0);
  const [nombreOriginal, setNombreOriginal] = useState<string>("Medicamento Original");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
        setError(false);

        // 1. Obtenemos el precio y nombre del medicamento original (¡Sin slash al final como acordamos!)
        try {
          const [infoRes, compRes] = await Promise.all([
            api.get(`/medicamentos/${id}`),
            api.get(`/comparacion/${id}`)
          ]);
          
          let infoData = infoRes.data.data || infoRes.data.medicamento || infoRes.data;
          if (Array.isArray(infoData)) infoData = infoData[0];
          
          setNombreOriginal(infoData.nombre_comercial || infoData.nombre || infoData["Principio Activo"] || "Medicamento Original");
          
          const precioCobradoRaw = compRes.data.precio_cobrado || compRes.data["Precio Cobrado"];
          const numeroLimpio = Number(String(precioCobradoRaw).replace(/[^0-9.-]+/g, ""));
          setPrecioOriginal(isNaN(numeroLimpio) ? 0 : numeroLimpio);
        } catch (err) {
          console.warn("No se pudo cargar el precio original para comparar.");
        }

        // 2. Obtenemos la lista de genéricos (¡Sin slash al final por si acaso!)
        const genResponse = await api.get(`/genericos/${id}`);
        const genData = genResponse.data.data || genResponse.data.genericos || genResponse.data;
        
        if (Array.isArray(genData)) {
          setGenericos(genData);
        } else {
          setGenericos([]);
        }

      } catch (err) {
        console.error("Error cargando genéricos:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDatos();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-azulMedio border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-medium text-azulMedio">Buscando alternativas más económicas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-rojoSemaforo mb-4">¡Ups! Algo salió mal</h1>
          <p className="text-lg text-[#1A1A1A]/70 max-w-md mb-8">No pudimos cargar las alternativas genéricas en este momento.</p>
          <Link href={`/medicamento/${id}`}>
            <button className="bg-azulMedio text-white px-6 py-3 rounded-lg hover:bg-azulOscuro transition-colors">
              Volver al medicamento
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <Link href={`/medicamento/${id}`} className="inline-block mb-6 text-azulMedio hover:text-azulOscuro font-medium text-sm">
          ← Volver al detalle
        </Link>

        <h1 className="text-[32px] font-bold text-azulOscuro mb-2">Alternativas Genéricas</h1>
        <p className="text-[18px] text-[#1A1A1A]/70 mb-8 pb-6 border-b">
          Opciones más económicas para: <strong className="text-[#1A1A1A]">{nombreOriginal}</strong>
        </p>

        {genericos.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-[0px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-lg text-[#1A1A1A]/70">No encontramos alternativas genéricas registradas para este medicamento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {genericos.map((gen, index) => {
              // Limpiamos el precio del genérico de forma segura
              const numeroLimpio = Number(String(gen.precio).replace(/[^0-9.-]+/g, ""));
              const precioGen = isNaN(numeroLimpio) ? 0 : numeroLimpio;
              
              // Calculamos el ahorro real
              const ahorro = precioOriginal > 0 ? (precioOriginal - precioGen) : 0;
              const idSeguro = gen.id || Math.random().toString();

              return (
                <div key={`${idSeguro}-${index}`} className="bg-white rounded-lg p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-verdeSemaforo">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-[20px] font-bold text-[#1A1A1A]">{gen.nombre_comercial || gen.principio_activo || "Genérico"}</h3>
                    <p className="text-[14px] text-[#1A1A1A]/70 mt-1">{gen.principio_activo}</p>
                    <p className="text-[18px] font-semibold text-azulOscuro mt-3">
                      Precio: ${precioGen.toFixed(2)}
                    </p>
                  </div>
                  
                  {ahorro > 0 && (
                    <div className="bg-verdeSemaforo/10 text-verdeSemaforo px-4 py-2 rounded-lg text-center min-w-[140px]">
                      <span className="block text-sm font-medium">Ahorras</span>
                      <span className="block text-xl font-bold">${ahorro.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
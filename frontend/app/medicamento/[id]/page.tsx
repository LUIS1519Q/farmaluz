'use client';

import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import SemaforoCard from '../../components/SemaforoCard';
import medicamentos from '../../../data/mockMedicamentos.json';

export default function DetalleMedicamento() {
  const params = useParams();
  const med = medicamentos.find(m => m.id === params.id);

  if (!med) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-azulOscuro">Medicamento no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.1)] p-8">
          
          <h1 className="text-[32px] font-bold text-azulOscuro mb-2">{med.nombre_comercial}</h1>
          <p className="text-[24px] font-semibold text-[#1A1A1A]/70 mb-8 border-b pb-6">
            {med.principio_activo} • {med.concentracion}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="space-y-4 text-[16px] mb-6 sm:mb-0">
              <div className="flex items-center space-x-3">
                <span className="text-[#1A1A1A]/60">Precio Techo Oficial:</span>
                <span className="font-semibold">${med.precio_techo.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#1A1A1A]/60">Precio en Farmacia:</span>
                <span className="font-semibold text-azulOscuro text-[20px]">${med.precio_cobrado.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex-shrink-0 scale-110 sm:scale-125 transform origin-left sm:origin-right mt-4 sm:mt-0">
              <SemaforoCard 
                estado={med.estado_semaforo as "VERDE" | "ROJO"} 
                porcentaje={med.porcentaje_sobreprecio} 
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
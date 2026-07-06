'use client';

import Image from 'next/image';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="w-full text-center space-y-6">
          
          <div className="space-y-4">
            <h1 className="text-[44px] md:text-[56px] font-extrabold text-azulOscuro tracking-tight leading-[1.1]">
              Detecta el sobreprecio en tu medicamento
            </h1>
            <p className="text-[18px] md:text-[20px] text-gray-600 font-normal max-w-3xl mx-auto">
              Compara precios de medicamentos en farmacias ecuatorianas con los precios techo oficiales del CNFRPM y ARCSA.
            </p>
          </div>

          <div className="w-full pt-8 pb-12">
            <SearchBar />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
            {/* Tarjeta 1 */}
            <div className="bg-white rounded-[20px] shadow-lg border border-gray-100 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 border-b-[8px] border-b-azulMedio">
              <div className="relative w-full h-[180px] bg-blue-50">
                <Image src="/assets/card-meds.png" alt="Medicamentos" fill className="object-cover" />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col justify-center bg-white">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-1">1,781 medicamentos</h3>
                <p className="text-[15px] text-gray-600">En nuestra base de datos</p>
              </div>
            </div>
            
            {/* Tarjeta 2 */}
            <div className="bg-white rounded-[20px] shadow-lg border border-gray-100 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 border-b-[8px] border-b-verdeSemaforo">
              <div className="relative w-full h-[180px] bg-green-50">
                <Image src="/assets/card-farmacias.png" alt="Farmacias" fill className="object-cover" />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col justify-center bg-white">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-1">2 farmacias monitoreadas</h3>
                <p className="text-[15px] text-gray-600">Actualización continua de precios</p>
              </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white rounded-[20px] shadow-lg border border-gray-100 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 border-b-[8px] border-b-azulMedio">
              <div className="relative w-full h-[180px] bg-blue-50">
                <Image src="/assets/card-datos.png" alt="Datos Oficiales" fill className="object-cover" />
              </div>
              <div className="p-6 text-center flex-1 flex flex-col justify-center bg-white">
                <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-1">Datos oficiales CNFRPM/ARCSA</h3>
                <p className="text-[15px] text-gray-600">Precios techo verificados y vigentes</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <footer className="w-full bg-[#F4F5F7] border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-[16px] md:text-[18px] font-medium text-gray-700">
          Fuente oficial de precios techo: CNFRPM / ARCSA Ecuador
        </div>
      </footer>
    </div>
  );
}
import Navbar from '../components/Navbar';
import Image from 'next/image';

export default function AcercaDe() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      
      {/* Usamos un contenedor más ancho para que ocupe casi toda la pantalla */}
      <main className="flex-1 max-w-[1300px] w-full mx-auto px-4 md:px-8 py-12 flex flex-col">
        
        <div className="text-center mb-12">
          <h1 className="text-[48px] md:text-[56px] font-extrabold text-azulOscuro mb-2 tracking-tight">
            Acerca de FarmaLuz
          </h1>
          <p className="text-[20px] text-gray-600 max-w-3xl mx-auto font-medium">
            Iluminando el acceso a la salud con transparencia y tecnología
          </p>
        </div>

        {/* Las 3 tarjetas con sus respectivos brillos */}
        <div className="grid md:grid-cols-3 gap-8 mb-4 relative z-10">
          
          {/* Tarjeta 1 - Brillo Azul */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 text-center flex flex-col items-center shadow-[0px_0px_25px_rgba(59,130,246,0.4)] border border-blue-100 hover:scale-[1.02] transition-transform">
             <div className="mb-6 h-40 w-full flex items-center justify-center relative">
                <Image src="/assets/acerca-transparencia.png" alt="Transparencia" fill className="object-contain" />
             </div>
             <h3 className="text-[22px] font-bold text-azulOscuro mb-3">Transparencia</h3>
             <p className="text-[16px] text-gray-600 leading-relaxed">
               Comparación de precios reales contra precios techo legales.
             </p>
          </div>

          {/* Tarjeta 2 - Brillo Verde */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 text-center flex flex-col items-center shadow-[0px_0px_25px_rgba(16,185,129,0.4)] border border-green-100 hover:scale-[1.02] transition-transform">
             <div className="mb-6 h-40 w-full flex items-center justify-center relative">
                <Image src="/assets/acerca-alternativas.png" alt="Alternativas Inteligentes" fill className="object-contain" />
             </div>
             <h3 className="text-[22px] font-bold text-azulOscuro mb-3">Alternativas Inteligentes</h3>
             <p className="text-[16px] text-gray-600 leading-relaxed">
               Identificación de genéricos y bioequivalentes con precios justos.
             </p>
          </div>

          {/* Tarjeta 3 - Brillo Azul Claro */}
          <div className="bg-white rounded-[24px] p-8 md:p-10 text-center flex flex-col items-center shadow-[0px_0px_25px_rgba(59,130,246,0.3)] border border-blue-100 hover:scale-[1.02] transition-transform">
             <div className="mb-6 h-40 w-full flex items-center justify-center relative">
                <Image src="/assets/acerca-proposito.png" alt="Propósito Social" fill className="object-contain" />
             </div>
             <h3 className="text-[22px] font-bold text-azulOscuro mb-3">Propósito Social</h3>
             <p className="text-[16px] text-gray-600 leading-relaxed">
               Empoderando a la ciudadanía para un consumo responsable de salud.
             </p>
          </div>

        </div>

        {/* Contenedor Inferior - El fondo se aplicará con la imagen que vas a pegar */}
        <div className="bg-azulOscuro bg-[url('/assets/fondo-uce.png')] bg-cover bg-top bg-no-repeat text-white rounded-[32px] shadow-2xl p-10 md:p-16 text-center relative overflow-hidden flex flex-col justify-end min-h-[350px] mt-8 z-10">
          <div className="relative z-10 mt-auto">
            <h2 className="text-[36px] md:text-[44px] font-bold mb-3 tracking-tight">Desarrollado en la UCE</h2>
            <p className="text-white/90 text-[18px] md:text-[20px] mb-8 font-medium">Universidad Central del Ecuador — Ingeniería en Sistemas</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Alex Chicaiza', 'Mateo Males', 'Luis Paspuezán', 'Jordan Sanchez', 'Vanessa Vela'].map(name => (
                <span key={name} className="px-5 py-2 bg-transparent rounded-full text-[16px] font-semibold border border-white/40 shadow-sm hover:bg-white/10 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
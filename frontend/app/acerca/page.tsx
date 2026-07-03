import Navbar from '../components/Navbar';
import { Heart, Shield, Users, Lightbulb } from 'lucide-react';

export default function AcercaDe() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-azulOscuro mb-4">Acerca de FarmaLuz</h1>
          <p className="text-lg text-[#1A1A1A]/70 max-w-2xl mx-auto">
            Iluminando el acceso a la salud con transparencia y tecnología.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-azulMedio/10 p-3 rounded-lg text-azulMedio flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-azulOscuro mb-2">Nuestro Propósito Social</h2>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                FarmaLuz nace con una misión clara: combatir la especulación de precios en el sector salud en Ecuador. 
                Nuestra plataforma empodera a los ciudadanos al proporcionarles una herramienta gratuita y de fácil acceso 
                para comparar los precios reales cobrados en las farmacias contra el precio techo oficial establecido por la ley. 
                Creemos que el acceso a la medicina a un precio justo es un derecho, no un privilegio.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10 border-t border-gray-100 pt-8">
            <div className="flex gap-4">
              <div className="bg-verdeSemaforo/10 p-3 rounded-lg text-verdeSemaforo flex-shrink-0 h-fit">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Transparencia</h3>
                <p className="text-sm text-[#1A1A1A]/70">
                  Extraemos datos reales para que tomes decisiones informadas, mostrando alertas visuales cuando existe un sobreprecio.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-azulMedio/10 p-3 rounded-lg text-azulMedio flex-shrink-0 h-fit">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Alternativas Inteligentes</h3>
                <p className="text-sm text-[#1A1A1A]/70">
                  Sugerimos opciones genéricas más económicas y brindamos asistencia mediante IA para resolver dudas generales sobre medicamentos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-azulOscuro text-white rounded-xl shadow-sm p-8 text-center">
          <Users className="w-8 h-8 mx-auto mb-4 text-azulClaro" />
          <h2 className="text-2xl font-bold mb-4">Desarrollado en la UCE</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
            Este proyecto fue desarrollado por el equipo 6 de la materia "Desarrollo de Sistemas de Información"
            de la carrera de Ingeniería en Sistemas de Información  de la Universidad Central del Ecuador (UCE). 
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm font-medium text-azulClaro">
            <span>Alex Chicaiza</span>
            <span>Mateo Males</span>
            <span>Luis Paspuezan</span>
            <span>Jordan Sanchez</span>
            <span>Vanessa Vela</span>
          </div>
        </div>
      </main>
    </div>
  );
}
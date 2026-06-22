import Link from 'next/link';
import { Pill } from 'lucide-react'; // Usamos Lucide para simular el concepto de logo flat

export default function Navbar() {
  return (
    <nav className="bg-azulOscuro text-white w-full h-16 px-6 flex items-center justify-between shadow-md">
      {/* Contenedor del Logo (Cruz médica / Pastilla con luz) */}
      <div className="flex items-center space-x-2">
        <div className="bg-white p-1.5 rounded-md flex items-center justify-center">
          <Pill className="w-6 h-6 text-verdeSemaforo" />
        </div>
        <span className="text-lg font-bold tracking-wider">FarmaLuz</span>
      </div>

      {/* Enlaces de navegación rápida */}
      <div className="flex space-x-6 text-[14px] font-medium">
        <Link href="/" className="hover:text-azulClaro transition-colors">
          Buscador
        </Link>
        <Link href="/chatbot" className="hover:text-azulClaro transition-colors">
          Chatbot
        </Link>
      </div>
    </nav>
  );
}
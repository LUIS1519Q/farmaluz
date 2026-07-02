'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pill, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const isHome = pathname === '/';
  const isAcerca = pathname === '/acerca';
  const isChatbot = pathname === '/chatbot';

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="relative z-[100]">
      {/* BARRA SUPERIOR FIJA */}
      <nav className="bg-azulOscuro text-white w-full h-16 shadow-md flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-1.5 rounded-md flex items-center justify-center">
            <Pill className="w-6 h-6 text-verdeSemaforo" />
          </div>
          <Link href="/">
            <span className="text-lg font-bold tracking-wider hover:text-gray-200 transition-colors">
              FarmaLuz
            </span>
          </Link>
        </div>

        {/* Botón Móvil */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          style={{ touchAction: 'manipulation' }}
          aria-expanded={menuAbierto}
          aria-label="Abrir menú de navegación"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Enlaces de Escritorio */}
        <div className="hidden md:flex space-x-6 text-[14px] font-medium">
          {isAcerca ? (
            <span className="text-white/50 cursor-not-allowed">Acerca de</span>
          ) : (
            <Link href="/acerca" className="hover:text-azulClaro transition-colors">Acerca de</Link>
          )}

          {isHome ? (
            <span className="text-white/50 cursor-not-allowed">Buscador</span>
          ) : (
            <Link href="/" className="hover:text-azulClaro transition-colors">Buscador</Link>
          )}

          {isChatbot ? (
            <span className="text-white/50 cursor-not-allowed">Chatbot</span>
          ) : (
            <Link href="/chatbot" className="hover:text-azulClaro transition-colors">Chatbot</Link>
          )}
        </div>
      </nav>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuAbierto && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-azulOscuro shadow-2xl flex flex-col border-t border-white/10">
          {isAcerca ? (
            <span className="text-white/50 font-medium p-4 border-b border-white/10">Acerca de</span>
          ) : (
            <Link href="/acerca" onClick={cerrarMenu} className="text-white hover:text-azulClaro font-medium p-4 border-b border-white/10 block">Acerca de</Link>
          )}

          {isHome ? (
            <span className="text-white/50 font-medium p-4 border-b border-white/10">Buscador</span>
          ) : (
            <Link href="/" onClick={cerrarMenu} className="text-white hover:text-azulClaro font-medium p-4 border-b border-white/10 block">Buscador</Link>
          )}

          {isChatbot ? (
            <span className="text-white/50 font-medium p-4 block">Chatbot</span>
          ) : (
            <Link href="/chatbot" onClick={cerrarMenu} className="text-white hover:text-azulClaro font-medium p-4 block">Chatbot</Link>
          )}
        </div>
      )}
    </header>
  );
}
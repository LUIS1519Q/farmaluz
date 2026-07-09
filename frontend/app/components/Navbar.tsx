'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Info, Search, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navItems = [
    { name: 'Acerca de', path: '/acerca', icon: Info },
    { name: 'Buscador', path: '/', icon: Search },
    { name: 'Chatbot', path: '/chatbot', icon: MessageSquare },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
  ];

  return (
    <header className="relative z-[100] w-full bg-white shadow-[0px_2px_15px_rgba(0,0,0,0.05)] border-b border-gray-100">
      <nav className="w-full flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto py-2">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/assets/nuevo-logo-farmaluz.png" 
              alt="Nuevo Logo FarmaLuz" 
              width={210} 
              height={55} 
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-azulOscuro"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>

        <div className="hidden md:flex space-x-5 text-[17px] font-semibold items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith('/resultados') && item.path === '/');
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`px-6 py-3 rounded-full border-[2px] transition-all duration-300 flex items-center gap-2 ${
                  isActive 
                    ? 'bg-azulMedio text-white border-azulMedio shadow-md' 
                    : 'bg-white text-azulOscuro border-azulOscuro/20 hover:border-azulMedio hover:text-azulMedio'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {menuAbierto && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl flex flex-col border-b border-gray-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (pathname.startsWith('/resultados') && item.path === '/');
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                onClick={() => setMenuAbierto(false)} 
                className={`p-5 border-b border-gray-100 font-semibold text-[17px] flex items-center gap-3 ${
                  isActive ? 'text-azulOscuro bg-blue-50' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
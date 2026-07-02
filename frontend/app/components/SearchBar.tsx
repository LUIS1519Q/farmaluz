'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navegación SPA sin recargar la página (soluciona el problema en móviles)
      router.push(`/resultados?q=${encodeURIComponent(query.trim().toLowerCase())}`);
    }
  };

  return (
    <form action="/resultados" method="GET" onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
      <input
        type="text" 
        name="q"
        inputMode="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ingresa el nombre comercial o principio activo..."
        className="w-full h-12 pl-4 pr-14 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-azulMedio text-[16px] text-[#1A1A1A]"
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-azulMedio hover:bg-azulOscuro text-white p-2 rounded-md transition-colors flex items-center justify-center"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
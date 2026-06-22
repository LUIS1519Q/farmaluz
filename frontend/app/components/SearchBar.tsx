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
      // Redirige a resultados pasando el texto como parámetro "q"
      router.push(`/resultados?q=${query.toLowerCase()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ingresa el nombre comercial o principio activo..."
        className="w-full h-12 pl-4 pr-14 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-azulMedio text-[16px] text-[#1A1A1A]"
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-azulMedio hover:bg-azulOscuro text-white p-2 rounded-md transition-colors flex items-center justify-center"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
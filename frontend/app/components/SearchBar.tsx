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
      router.push(`/resultados?q=${encodeURIComponent(query.trim().toLowerCase())}`);
    }
  };

  return (
    <form action="/resultados" method="GET" onSubmit={handleSearch} className="relative w-full max-w-4xl mx-auto flex shadow-lg rounded-lg overflow-hidden border border-gray-200 bg-white">
      <input
        type="text" 
        name="q"
        inputMode="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca por nombre, principio activo o laboratorio..."
        className="flex-1 h-14 pl-6 pr-4 text-[16px] md:text-[18px] text-gray-700 focus:outline-none placeholder-gray-500"
      />
      <button 
        type="submit"
        className="bg-azulMedio hover:bg-azulOscuro text-white px-6 md:px-10 flex items-center justify-center gap-2 font-semibold text-[16px] transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="hidden md:inline">BUSCAR</span>
      </button>
    </form>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { api } from '../../lib/api';

interface Mensaje {
  id: number;
  texto: string;
  emisor: 'usuario' | 'bot';
}

export default function Chatbot() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: 1,
      texto: "¡Hola! Soy el asistente de FarmaLuz. ¿Tienes alguna duda sobre algún medicamento o principio activo?",
      emisor: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll hacia abajo cuando hay un mensaje nuevo
  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [mensajes, escribiendo]);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const textoUsuario = input;
    setInput(''); // Limpiamos el input
    
    // Agregamos el mensaje del usuario a la pantalla
    setMensajes(prev => [...prev, { id: Date.now(), texto: textoUsuario, emisor: 'usuario' }]);
    setEscribiendo(true);

    try {
      // Petición al endpoint de Vela con el formato acordado { pregunta: string }
      const response = await api.post('/chatbot/consulta', { pregunta: textoUsuario });
      
      const respuestaBot = response.data.respuesta || response.data.mensaje || "No recibí una respuesta válida del servidor.";

      setMensajes(prev => [...prev, { id: Date.now() + 1, texto: respuestaBot, emisor: 'bot' }]);
    } catch (error) {
      console.error("Error en el chatbot:", error);
      setMensajes(prev => [...prev, { 
        id: Date.now() + 1, 
        texto: "Lo siento, estoy teniendo problemas para conectarme con mi cerebro de IA en este momento. Intenta de nuevo más tarde.", 
        emisor: 'bot' 
      }]);
    } finally {
      setEscribiendo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
        
        {/* Cabecera y Aviso Legal */}
        <div className="bg-white rounded-t-xl p-4 shadow-sm border-b border-gray-100 flex justify-between items-center z-10">
          <div>
            <h1 className="text-xl font-bold text-azulOscuro">Asistente IA</h1>
            <p className="text-xs font-medium text-rojoSemaforo mt-1 bg-rojoSemaforo/10 inline-block px-2 py-1 rounded">
              ⚠️ Esta información es educativa y no reemplaza la consulta médica.
            </p>
          </div>
          <Link href="/resultados">
            <button className="text-azulMedio hover:text-azulOscuro text-sm font-medium">
              Cerrar ✕
            </button>
          </Link>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 bg-white p-4 overflow-y-auto flex flex-col space-y-4">
          {mensajes.map((msg) => (
            <div key={msg.id} className={`flex ${msg.emisor === 'usuario' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.emisor === 'usuario' 
                  ? 'bg-azulMedio text-white rounded-br-none' 
                  : 'bg-gray-100 text-[#1A1A1A] rounded-bl-none'
              }`}>
                {msg.texto}
              </div>
            </div>
          ))}
          
          {/* Indicador de "Escribiendo..." */}
          {escribiendo && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-none px-5 py-4 flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={mensajesEndRef} />
        </div>

        {/* Input para enviar mensaje */}
        <div className="bg-white rounded-b-xl p-4 shadow-sm border-t border-gray-100">
          <form onSubmit={enviarMensaje} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-azulMedio text-[#1A1A1A]"
              disabled={escribiendo}
            />
            <button
              type="submit"
              disabled={!input.trim() || escribiendo}
              className="bg-azulMedio text-white px-6 py-3 rounded-lg font-medium hover:bg-azulOscuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
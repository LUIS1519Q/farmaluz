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

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [mensajes, escribiendo]);

  const enviarMensaje = async (textoDirecto?: string) => {
    const textoAEnviar = textoDirecto || input;
    if (!textoAEnviar.trim()) return;

    setInput(''); 
    
    setMensajes(prev => [...prev, { id: Date.now(), texto: textoAEnviar, emisor: 'usuario' }]);
    setEscribiendo(true);

    const historialActual = mensajes.map(m => ({
      rol: m.emisor,
      contenido: m.texto
    }));

    try {
      const response = await api.post('/chatbot/consulta', { 
        pregunta: textoAEnviar, 
        historial: historialActual 
      });
      
      const respuestaBot = response.data.respuesta || response.data.mensaje || "No recibí una respuesta válida del servidor.";

      setMensajes(prev => [...prev, { id: Date.now() + 1, texto: respuestaBot, emisor: 'bot' }]);
    } catch (error) {
      console.error("Error en el chatbot:", error);
      setMensajes(prev => [...prev, { 
        id: Date.now() + 1, 
        texto: "Lo siento, estoy teniendo problemas de conexión. Intenta de nuevo más tarde.", 
        emisor: 'bot' 
      }]);
    } finally {
      setEscribiendo(false);
    }
  };

  // 🌟 FUNCIÓN MAESTRA MEJORADA: Negritas automáticas en listas
  const formatearTexto = (texto: string) => {
    if (!texto) return null;

    return texto.split('\n').map((linea, index) => {
      const lineaLimpia = linea.trim();
      
      // Si la línea está vacía, hacemos un salto de línea sutil
      if (!lineaLimpia) return <div key={index} className="h-2"></div>;

      // Detectar lista (*, -, +, o •)
      const matchLista = lineaLimpia.match(/^[-*+•]\s+(.*)/);
      let contenido = matchLista ? matchLista[1] : lineaLimpia;
      
      // Sangría para sublistas
      let esSublista = linea.startsWith('  ') || linea.trim().startsWith('+');

      // 🎯 NUEVA LÓGICA: Auto-Negrita antes de los dos puntos
      if (matchLista && contenido.includes(':')) {
        const primerDosPuntos = contenido.indexOf(':');
        // Extraemos el texto antes de los dos puntos y limpiamos asteriscos por si acaso
        const titulo = contenido.substring(0, primerDosPuntos).replace(/\*\*/g, '');
        // Extraemos el resto del texto (incluyendo los dos puntos)
        const resto = contenido.substring(primerDosPuntos);
        
        // Reconstruimos el contenido forzando el formato Markdown
        contenido = `**${titulo}**${resto}`;
      }

      // Detectar y aplicar negritas (Busca todo lo que esté entre **)
      const partes = contenido.split(/(\*\*.*?\*\*)/g);
      const textoFormateado = partes.map((parte, i) => {
        if (parte.startsWith('**') && parte.endsWith('**')) {
          return <strong key={i} className="font-bold text-gray-900">{parte.slice(2, -2)}</strong>;
        }
        return <span key={i}>{parte}</span>;
      });

      // Renderizar con viñetas bonitas
      if (matchLista) {
        return (
          <div key={index} className={`flex items-start gap-2 mt-1.5 ${esSublista ? 'ml-6' : 'ml-2'}`}>
            <span className="text-azulMedio mt-0.5 text-lg leading-none">•</span>
            <div className="flex-1">{textoFormateado}</div>
          </div>
        );
      }

      // Renderizar párrafo normal
      return <div key={index} className="mt-2 text-gray-800">{textoFormateado}</div>;
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
        
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

        <div className="flex-1 bg-white p-4 overflow-y-auto flex flex-col space-y-4">
          {mensajes.map((msg, index) => {
            
            let textoPrincipal = msg.texto;
            let avisoLegal = "";
            let sugerencias: string[] = [];

            if (msg.emisor === 'bot') {
              
              // 1. LA ASPIRADORA DE AVISOS LEGALES
              // Fase A: Destruye el formato de corchetes [AVISO LEGAL: ...]
              if (textoPrincipal.includes("[AVISO LEGAL:")) {
                const partes = textoPrincipal.split("[AVISO LEGAL:");
                textoPrincipal = partes[0].trim();
                avisoLegal = partes[1].replace("]", "").trim();
              }
              
              // Fase B: Destruye el formato en texto "Recuerda que..."
              const regexAlternativo = /Recuerda que.*?estrictamente educativa.*?profesional de la salud\.?/gi;
              const matchAlternativo = textoPrincipal.match(regexAlternativo);
              if (matchAlternativo) {
                if (!avisoLegal) {
                  avisoLegal = matchAlternativo[0]; // Lo guardamos para la cajita azul si no había otro
                }
                // Lo eliminamos por completo del texto principal
                textoPrincipal = textoPrincipal.replace(regexAlternativo, '').trim();
              }
              
              // 2. EXTRAER SUGERENCIAS
              const textoLower = textoPrincipal.toLowerCase();
              const keyword = textoLower.includes("preguntas sugeridas") 
                ? "preguntas sugeridas" 
                : (textoLower.includes("sugerencias") ? "sugerencias" : null);

              if (keyword) {
                const indice = textoLower.lastIndexOf(keyword);
                const textoAntes = textoPrincipal.substring(0, indice);
                const textoDespues = textoPrincipal.substring(indice);
                
                textoPrincipal = textoAntes.replace(/\*\*$/, '').trim();
                
                sugerencias = textoDespues
                  .split('\n')
                  .slice(1) 
                  .map(s => s.replace(/^[-*•\d.)\s]+/, '').trim()) 
                  .filter(s => s.length > 5);
              }

              // 3. FALLBACK DE SUGERENCIAS
              if (sugerencias.length === 0 && index >= 2) {
                sugerencias = [
                  "¿Cuánto tiempo tarda en hacer efecto?",
                  "¿Cuál es la dosis recomendada?",
                  "¿Existen contraindicaciones?"
                ];
              }
            }

            const esUltimoMensaje = index === mensajes.length - 1;
            const mensajeAnterior = index > 0 ? mensajes[index - 1] : null;
            const esConversacionTerminada = mensajeAnterior && mensajeAnterior.texto.includes("No necesito nada más");

            const mostrarBotonDespedida = index >= 2 && !esConversacionTerminada;

            return (
              <div key={msg.id} className={`flex ${msg.emisor === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                  msg.emisor === 'usuario' 
                    ? 'bg-azulMedio text-white rounded-br-none' 
                    : 'bg-gray-50 text-gray-700 rounded-bl-none border border-gray-100'
                }`}>
                  
                  {/* TEXTO FORMATEADO */}
                  <div className="leading-relaxed text-[15px]">
                    {msg.emisor === 'bot' ? formatearTexto(textoPrincipal) : textoPrincipal}
                  </div>
                  
                  {/* BOTONES */}
                  {(sugerencias.length > 0 || mostrarBotonDespedida) && esUltimoMensaje && msg.emisor === 'bot' && !esConversacionTerminada && (
                    <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-200/60">
                      {sugerencias.map((sugerencia, idx) => (
                        <button
                          key={idx}
                          onClick={() => enviarMensaje(sugerencia)}
                          className="text-xs bg-white border border-azulMedio text-azulMedio px-3 py-1.5 rounded-full hover:bg-azulMedio hover:text-white transition shadow-sm font-medium"
                        >
                          {sugerencia}
                        </button>
                      ))}
                      
                      {mostrarBotonDespedida && (
                        <button
                          onClick={() => enviarMensaje("No necesito nada más")}
                          className="text-xs bg-gray-100 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 hover:text-gray-800 transition shadow-sm font-medium"
                        >
                          No necesito nada más
                        </button>
                      )}
                    </div>
                  )}

                  {/* AVISO LEGAL EN CAJA AZUL */}
                  {avisoLegal && (
                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-start gap-2 text-[11px] text-gray-500 font-medium">
                      <span className="text-sm mt-0.5">ℹ️</span>
                      <p><strong>AVISO LEGAL:</strong> {avisoLegal}</p>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
          
          {mensajes.length === 1 && (
            <div className="mt-6 animate-fade-in">
              <p className="text-sm text-gray-500 mb-3 ml-1 font-medium">Puedes preguntarme cosas como:</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => enviarMensaje("¿Cuál es la diferencia entre un medicamento genérico y uno de marca?")} className="flex flex-col text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-azulMedio hover:bg-azulMedio/5 transition shadow-sm group">
                  <span className="font-semibold text-[#1A1A1A] text-sm group-hover:text-azulMedio">Genéricos vs. Marca</span>
                  <span className="text-xs text-gray-500 mt-1">Conoce las diferencias y beneficios de cada uno</span>
                </button>
                <button onClick={() => enviarMensaje("¿Para qué sirve el ibuprofeno y cuáles son sus precauciones?")} className="flex flex-col text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-azulMedio hover:bg-azulMedio/5 transition shadow-sm group">
                  <span className="font-semibold text-[#1A1A1A] text-sm group-hover:text-azulMedio">Uso de analgésicos</span>
                  <span className="text-xs text-gray-500 mt-1">Información sobre el ibuprofeno y medicamentos comunes</span>
                </button>
                <button onClick={() => enviarMensaje("¿Qué principios activos son comunes para el malestar estomacal?")} className="flex flex-col text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-azulMedio hover:bg-azulMedio/5 transition shadow-sm group">
                  <span className="font-semibold text-[#1A1A1A] text-sm group-hover:text-azulMedio">Malestar estomacal</span>
                  <span className="text-xs text-gray-500 mt-1">Opciones educativas para la acidez o dolor de estómago</span>
                </button>
              </div>
            </div>
          )}

          {escribiendo && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-none px-5 py-4 flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={mensajesEndRef} />
        </div>

        <div className="bg-white rounded-b-xl p-4 shadow-sm border-t border-gray-100">
          <form onSubmit={(e) => { e.preventDefault(); enviarMensaje(); }} className="flex space-x-2">
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
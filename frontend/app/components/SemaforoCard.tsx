import { CheckCircle, AlertTriangle } from 'lucide-react';

interface SemaforoProps {
  estado: 'VERDE' | 'ROJO';
  porcentaje: number;
}

export default function SemaforoCard({ estado, porcentaje }: SemaforoProps) {
  const esVerde = estado === 'VERDE';

  return (
    <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-white text-[12px] font-medium shadow-sm w-fit ${esVerde ? 'bg-verdeSemaforo' : 'bg-rojoSemaforo'}`}>
      {esVerde ? (
        <>
          <CheckCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span>Precio Justo</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span>Sobreprecio {porcentaje}%</span>
        </>
      )}
    </div>
  );
}
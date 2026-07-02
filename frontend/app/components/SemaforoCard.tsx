import { CheckCircle, AlertTriangle } from 'lucide-react';

interface SemaforoProps {
  estado: 'VERDE' | 'ROJO';
  porcentaje: number;
}

export default function SemaforoCard({ estado, porcentaje }: SemaforoProps) {
  const esVerde = estado === 'VERDE';

  return (
    <div className={`flex items-center justify-center w-[120px] h-[48px] rounded-lg text-white text-[12px] font-medium ${esVerde ? 'bg-verdeSemaforo' : 'bg-rojoSemaforo'}`}>
      {esVerde ? (
        <>
          <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>Precio Justo</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[12px]">Sobreprecio</span>
            <span className="text-[12px] font-bold">{porcentaje}%</span>
          </div>
        </>
      )}
    </div>
  );
}
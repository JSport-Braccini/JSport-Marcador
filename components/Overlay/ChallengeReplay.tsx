
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'full' | 'mini';
}

const ChallengeReplay: React.FC<Props> = ({ isOpen, onClose, mode = 'full' }) => {
  const [result, setResult] = useState<'DENTRO' | 'FUERA' | 'ESCANEO'>('ESCANEO');

  useEffect(() => {
    if (isOpen) {
      setResult('ESCANEO');
      const timer = setTimeout(() => {
        setResult(Math.random() > 0.5 ? 'DENTRO' : 'FUERA');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMini = mode === 'mini';

  return (
    <div className={`fixed z-[100] flex flex-col items-center justify-center transition-all duration-500 ${isMini ? 'top-6 left-6 w-80 aspect-video' : 'inset-0 bg-black/90 backdrop-blur-md'}`}>
      <div className={`relative w-full h-full bg-slate-900 border-4 border-amber-400 overflow-hidden flex items-center justify-center shadow-2xl ${isMini ? 'rounded-xl' : 'max-w-4xl aspect-video'}`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute w-full h-0.5 bg-white top-1/2 -translate-y-1/2 shadow-[0_0_10px_white]" />
          <div className="absolute h-full w-0.5 bg-white left-1/2 -translate-x-1/2 shadow-[0_0_10px_white]" />
        </div>

        <div className={`
          absolute rounded-full border-4 border-amber-500 bg-amber-400/20 backdrop-blur-sm
          ${result === 'ESCANEO' ? 'animate-pulse scale-110' : 'scale-100'}
          ${isMini ? 'w-12 h-12' : 'w-24 h-24'}
          transition-all duration-700
        `}>
          <div className={`absolute inset-0 flex items-center justify-center text-slate-950 font-black italic ${isMini ? 'text-[8px]' : 'text-xl'}`}>VNL</div>
        </div>

        {result !== 'ESCANEO' && (
          <div className={`absolute bottom-0 left-0 right-0 font-black italic tracking-tighter ${result === 'DENTRO' ? 'bg-emerald-500' : 'bg-rose-500'} animate-slide-up shadow-2xl text-white ${isMini ? 'py-2 text-2xl' : 'py-10 text-8xl'}`}>
             {result}
          </div>
        )}

        {result === 'ESCANEO' && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black uppercase animate-pulse rounded border border-slate-950/20 ${isMini ? 'px-3 py-1 text-[6px]' : 'px-8 py-2 text-[10px]'}`}>
            ESCANEO HAWK-EYE
          </div>
        )}
      </div>

      {!isMini && (
        <button onClick={onClose} className="mt-8 px-12 py-3 bg-white text-black font-black hover:bg-amber-400 transition-colors uppercase tracking-widest rounded-xl">Cerrar</button>
      )}
      {isMini && (
        <button onClick={onClose} className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg"><X size={12}/></button>
      )}

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ChallengeReplay;

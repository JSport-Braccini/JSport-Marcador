
import React, { useState, useEffect } from 'react';

const ChallengeReplay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [result, setResult] = useState<'DENTRO' | 'FUERA' | 'SCANNING'>('SCANNING');

  useEffect(() => {
    if (isOpen) {
      setResult('SCANNING');
      const timer = setTimeout(() => {
        setResult(Math.random() > 0.5 ? 'DENTRO' : 'FUERA');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl aspect-video bg-slate-900 border-4 border-amber-400 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute w-full h-1 bg-white top-1/2 -translate-y-1/2 shadow-[0_0_20px_white]" />
          <div className="absolute h-full w-1 bg-white left-1/2 -translate-x-1/2 shadow-[0_0_20px_white]" />
        </div>

        <div className={`
          absolute w-24 h-24 rounded-full border-4 border-amber-500 bg-amber-300
          ${result === 'SCANNING' ? 'animate-pulse scale-110 blur-sm' : 'scale-100'}
          transition-all duration-700 ease-out
        `}>
          <div className="absolute inset-0 flex items-center justify-center text-slate-950 font-black italic">VNL</div>
        </div>

        {result !== 'SCANNING' && (
          <div className={`absolute bottom-0 left-0 right-0 py-12 text-center text-8xl font-black italic tracking-tighter ${result === 'DENTRO' ? 'bg-emerald-500' : 'bg-rose-500'} animate-slide-up`}>
             {result}
          </div>
        )}

        {result === 'SCANNING' && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 px-8 py-2 font-bold uppercase animate-pulse">
            SISTEMA DE CHALLENGE ANALIZANDO...
          </div>
        )}
      </div>

      <button 
        onClick={onClose}
        className="mt-8 px-12 py-3 bg-white text-black font-bold hover:bg-amber-400 transition-colors uppercase tracking-widest rounded-xl"
      >
        Volver al Partido
      </button>
    </div>
  );
};

export default ChallengeReplay;

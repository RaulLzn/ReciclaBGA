import React, { useState, useEffect } from 'react';
import { useEpicStore } from '../store/epicStore';
import { Trophy, Clock, X, Play } from 'lucide-react';

export function MinigameUI() {
  const { isMinigameActive, setMinigameActive, minigameScore, resetMinigame } = useEpicStore();
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  useEffect(() => {
    if (isMinigameActive && gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isMinigameActive, gameState]);

  const startGame = () => {
    resetMinigame();
    setTimeLeft(60);
    setGameState('playing');
    setMinigameActive(true);
  };

  const closeGame = () => {
    setMinigameActive(false);
    setGameState('idle');
  };

  if (!isMinigameActive && gameState === 'idle') {
    return (
      <button 
        onClick={startGame}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 font-bold z-50"
      >
        <Play className="w-5 h-5" />
        Minijuego 3D
      </button>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col">
      {/* Top Bar */}
      {gameState === 'playing' && (
        <div className="p-6 flex justify-between items-start pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center gap-6 border border-white/20">
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tiempo</span>
              <div className={`text-3xl font-black flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                <Clock className="w-6 h-6" />
                {timeLeft}s
              </div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Puntos</span>
              <div className="text-3xl font-black text-emerald-600 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                {minigameScore}
              </div>
            </div>
          </div>
          
          <button 
            onClick={closeGame}
            className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center transform animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">¡Tiempo Terminado!</h2>
            <p className="text-gray-600 mb-6">Has clasificado residuos y ayudado a mantener limpia la ciudad.</p>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8">
              <span className="block text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Puntuación Final</span>
              <span className="block text-5xl font-black text-emerald-600">{minigameScore}</span>
              <span className="block text-sm text-emerald-600/80 font-medium mt-2">+ {minigameScore} Puntos de Impacto añadidos a tu perfil</span>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={closeGame}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
              <button 
                onClick={startGame}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
              >
                Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

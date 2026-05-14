import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEpicStore, TutorialStep } from '../store/epicStore';
import { CheckCircle2, ChevronRight, X, Map, MousePointerClick, PlayCircle, Store } from 'lucide-react';

const TUTORIAL_CONTENT: Record<TutorialStep, { title: string; desc: string; icon: React.ReactNode }> = {
  welcome: {
    title: '¡Bienvenido a Recicla BGA!',
    desc: 'Explora la ciudad y aprende a reciclar. Haz clic en las zonas parpadeantes para comenzar.',
    icon: <Map className="text-cyan-400" size={24} />,
  },
  navigation: {
    title: 'Viaja por la ciudad',
    desc: 'Usa los botones de abajo para viajar entre el Hogar, la Universidad y la Planta ECA.',
    icon: <ChevronRight className="text-emerald-400" size={24} />,
  },
  interact: {
    title: '¡Un objeto interactivo!',
    desc: 'Haz clic en las canecas, personas o vehículos para limpiar la ciudad y ganar puntos.',
    icon: <MousePointerClick className="text-amber-400" size={24} />,
  },
  minigame: {
    title: 'Minijuego Activo',
    desc: 'Clasifica los residuos que caen antes de que acabe el tiempo y gana Puntos de Impacto.',
    icon: <PlayCircle className="text-pink-400" size={24} />,
  },
  store: {
    title: 'Eco-Tienda Desbloqueada',
    desc: 'Usa tus puntos en la Eco-Tienda para canjear descuentos reales en negocios locales.',
    icon: <Store className="text-purple-400" size={24} />,
  },
};

export function TutorialOverlay() {
  const { currentTutorial, markTutorialSeen } = useEpicStore();

  if (!currentTutorial) return null;

  const content = TUTORIAL_CONTENT[currentTutorial];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full pointer-events-auto relative"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <button 
            onClick={() => markTutorialSeen(currentTutorial)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center mt-2">
            <div className="bg-slate-800 p-4 rounded-2xl mb-4 shadow-inner border border-slate-700">
              {content.icon}
            </div>
            <h3 className="text-xl font-black text-white mb-2">{content.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {content.desc}
            </p>

            <button
              onClick={() => markTutorialSeen(currentTutorial)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2"
            >
              Entendido <CheckCircle2 size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

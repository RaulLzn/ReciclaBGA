import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEpicStore, ZONES, ZoneId } from '../store/epicStore';
import { Trophy, Info, MapPin, CheckCircle2 } from 'lucide-react';

export function EpicUI() {
  const { activeZone, setActiveZone, points, discoveredTips, setGamificationModalOpen, isMinigameActive } = useEpicStore();
  const zone = ZONES[activeZone];

  const totalPoints = 110; // 11 interactive objects * 10 points
  const progress = Math.min((points / totalPoints) * 100, 100);

  if (isMinigameActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-10 text-slate-100 font-sans overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start w-full pointer-events-none gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-2xl border border-slate-700/50 pointer-events-auto max-w-sm w-full md:w-auto"
        >
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-1 md:mb-2 tracking-tight">
            Recicla BGA
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed hidden sm:block">
            Explora el ecosistema de reciclaje del área metropolitana de Bucaramanga en este modelo interactivo 3D.
          </p>
        </motion.div>

        {/* Gamification Toggle Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setGamificationModalOpen(true)}
          className="pointer-events-auto cursor-pointer bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col gap-3 hover:bg-slate-800/80 transition-colors w-full md:w-auto"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl text-white shadow-lg shadow-amber-500/20">
              <Trophy size={24} />
            </div>
            <div className="text-left pr-2">
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Puntos de Impacto
              </p>
              <p className="text-xl md:text-2xl font-black text-white leading-none">
                {points} <span className="text-xs md:text-sm text-amber-400">/ {totalPoints} pts</span>
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          {points >= totalPoints && (
            <p className="text-xs font-bold text-emerald-400 text-center mt-1 animate-pulse">
              ¡Misión Cumplida! Eres un experto.
            </p>
          )}
        </motion.div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col-reverse md:flex-row items-end justify-between pb-2 md:pb-8 relative gap-4 pointer-events-none">
        
        {/* Contextual Info Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-slate-900/80 backdrop-blur-2xl p-5 md:p-8 rounded-3xl shadow-2xl border border-slate-700/50 pointer-events-auto max-w-md w-full relative overflow-y-auto max-h-[45vh] md:max-h-[65vh] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
          >
            {/* Decorative glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase mb-3 md:mb-4 border border-cyan-500/30">
                {zone.subtitle}
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4 tracking-tight">
                {zone.title}
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4 md:mb-6">
                {zone.description}
              </p>

              {/* Tips Section */}
              {zone.tips.length > 0 && (
                <div className="space-y-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-700/50">
                  <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                    <Info size={16} />
                    Objetos Interactivos
                  </h3>
                  {zone.tips.map((tip) => {
                    const isDiscovered = discoveredTips.includes(tip.id);
                    return (
                      <div 
                        key={tip.id}
                        className={`p-3 md:p-4 rounded-xl border transition-all duration-300 ${
                          isDiscovered 
                            ? 'bg-slate-800/80 border-emerald-500/30' 
                            : 'bg-slate-800/30 border-slate-700/50 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${isDiscovered ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isDiscovered ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-600" />}
                          </div>
                          <div>
                            <h4 className={`font-bold text-xs md:text-sm mb-1 ${isDiscovered ? 'text-white' : 'text-slate-400'}`}>
                              {isDiscovered ? tip.title : 'Objeto Oculto'}
                            </h4>
                            <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">
                              {isDiscovered ? tip.desc : 'Encuentra y haz clic en este objeto en el modelo 3D para revelar su información.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-3 pointer-events-auto overflow-x-auto w-full md:w-auto pb-2 md:pb-0 snap-x scrollbar-none">
          {(Object.keys(ZONES) as ZoneId[]).map((zoneKey) => {
            const z = ZONES[zoneKey];
            const isActive = activeZone === zoneKey;
            return (
              <button
                key={zoneKey}
                onClick={() => setActiveZone(zoneKey)}
                className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-all duration-300 backdrop-blur-xl border shrink-0 snap-center ${
                  isActive 
                    ? 'bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
                    : 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600/50'
                }`}
              >
                <div className={`p-2 rounded-full ${isActive ? 'bg-cyan-400 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                  <MapPin size={18} className="md:w-5 md:h-5" />
                </div>
                <div className="text-left">
                  <p className={`text-xs md:text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {z.title}
                  </p>
                  <p className={`text-[10px] md:text-xs ${isActive ? 'text-cyan-200' : 'text-slate-500'} hidden sm:block`}>
                    {z.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

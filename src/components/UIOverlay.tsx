import { useAppContext } from "../store";
import { STAGES } from "../constants";
import { ChevronLeft, ChevronRight, Info, X, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GamificationDashboard } from "./GamificationDashboard";

export function UIOverlay() {
  const {
    currentStageIndex,
    nextStage,
    prevStage,
    activeInfo,
    setActiveInfo,
    toggleGamification,
    userProfile,
  } = useAppContext();
  const stage = STAGES[currentStageIndex];

  return (
    <>
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg pointer-events-auto max-w-sm">
            <h1 className="text-2xl font-bold text-emerald-800 mb-1">
              Recicla Bucaramanga
            </h1>
            <p className="text-sm text-gray-600">
              Un recorrido interactivo por el ciclo del reciclaje en el área
              metropolitana.
            </p>
          </div>

          {/* Gamification Toggle Button */}
          <button
            onClick={toggleGamification}
            className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg flex items-center gap-3 hover:bg-emerald-50 transition-colors border-2 border-transparent hover:border-emerald-200"
          >
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <Trophy size={24} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Nivel {userProfile.level}
              </p>
              <p className="text-lg font-black text-emerald-700 leading-none">
                {userProfile.points} pts
              </p>
            </div>
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-end justify-center pb-20 relative">
          {/* Stage Info Panel */}
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl pointer-events-auto max-w-2xl w-full text-center relative"
          >
            {/* Interaction Hint */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md animate-bounce whitespace-nowrap flex items-center gap-2">
              <Info size={16} />
              Haz clic en los objetos 3D para aprender más (+10 pts)
            </div>

            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              {stage.subtitle}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {stage.title}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {stage.description}
            </p>
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 pointer-events-auto">
          <button
            onClick={prevStage}
            disabled={currentStageIndex === 0}
            className="p-3 bg-white text-gray-800 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-2">
            {STAGES.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentStageIndex
                    ? "bg-emerald-600 w-8"
                    : "bg-white/60 shadow-sm"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStage}
            disabled={currentStageIndex === STAGES.length - 1}
            className="p-3 bg-emerald-600 text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Gamification Dashboard */}
      <GamificationDashboard />
    </>
  );
}

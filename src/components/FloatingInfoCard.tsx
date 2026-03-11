import { Html } from "@react-three/drei";
import { useAppContext } from "../store";
import { X, Radar, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FloatingInfoCard({ id, position = [0, 1.5, 0], color }: { id: string, position?: [number, number, number], color: string }) {
  const { activeInfo, setActiveInfo, addScore } = useAppContext();
  
  const isActive = activeInfo?.id === id;

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeInfo) {
      addScore(activeInfo.points);
      setActiveInfo(null);
    }
  };

  return (
    <Html position={position} center zIndexRange={[100, 0]} className={isActive ? "pointer-events-auto" : "pointer-events-none"}>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, rotateX: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative w-80 p-5 backdrop-blur-2xl bg-black/80 border border-white/5 rounded-sm overflow-hidden"
            style={{ boxShadow: `0 0 40px ${color}22, inset 0 0 20px ${color}11` }}
          >
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
            
            {/* Top border accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }} />

            <button
              onClick={(e) => { e.stopPropagation(); setActiveInfo(null); }}
              className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-sm bg-black/50 border border-white/10" style={{ color }}>
                  <Radar size={20} className="animate-pulse" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-mono">
                    ID: {activeInfo.id.toUpperCase()}
                  </div>
                  <h3 className="font-bold text-white text-sm tracking-widest font-mono uppercase" style={{ textShadow: `0 0 10px ${color}` }}>
                    {activeInfo.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-xs text-white/60 leading-relaxed font-mono mb-5 text-justify">
                {activeInfo.content}
              </p>

              <button 
                onClick={handleCollect}
                className="w-full py-2.5 px-4 rounded-sm flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  backgroundColor: `${color}15`, 
                  color: color,
                  border: `1px solid ${color}40`,
                  textShadow: `0 0 10px ${color}`
                }}
              >
                <Zap size={14} />
                Extraer Datos (+{activeInfo.points} TB)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
}

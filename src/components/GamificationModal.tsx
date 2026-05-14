import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEpicStore, AVAILABLE_BADGES, ActionType } from '../store/epicStore';
import { Trophy, X, Home, BookOpen, Briefcase, Share2, Medal, Award, Star, MapPin, ShoppingBag, Tag, ChevronRight } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { id: '1', name: 'María Gómez', area: 'Bucaramanga', points: 450 },
  { id: '2', name: 'Carlos Ruiz', area: 'Floridablanca', points: 420 },
  { id: '3', name: 'Ana Silva', area: 'Piedecuesta', points: 380 },
  { id: '4', name: 'Juan Pérez', area: 'Girón', points: 350 },
  { id: '5', name: 'Laura Torres', area: 'Bucaramanga', points: 310 },
];

const MOCK_REWARDS = [
  { id: 'r1', title: '15% Dto. Café Local', sponsor: 'Cafés de Santander', cost: 50, desc: 'Aplica para todas las bebidas a base de espresso.', icon: '☕' },
  { id: 'r2', title: 'Bolsa Ecológica Tela', sponsor: 'Mercados BGA', cost: 120, desc: 'Reclámala en cualquier punto principal mostrando el código.', icon: '🛍️' },
  { id: 'r3', title: '2x1 Cine Colombia', sponsor: 'Cine Cacique', cost: 300, desc: 'Válido de martes a jueves en salas 2D.', icon: '🎫' },
  { id: 'r4', title: ' Hamburguesa 50% Off', sponsor: 'El Garaje/Ruitoque', cost: 500, desc: 'Mitad de precio en combo clásico.', icon: '🍔' },
];

export function GamificationModal() {
  const { 
    isGamificationModalOpen, 
    setGamificationModalOpen, 
    points, 
    badges, 
    registerAction,
    registeredActions,
    isMinigameActive,
    redeemReward,
    redeemedRewards
  } = useEpicStore();

  const [activeTab, setActiveTab] = useState<'actions' | 'rewards' | 'badges' | 'leaderboard'>('actions');

  if (!isGamificationModalOpen || isMinigameActive) return null;

  const handleRegisterAction = (type: ActionType) => {
    registerAction(type);
  };

  // Insert current user into leaderboard
  const currentLeaderboard = [...MOCK_LEADERBOARD, { id: 'me', name: 'Tú', area: 'Bucaramanga', points }]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl text-white shadow-lg shadow-amber-500/20">
                <Trophy size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Tu Impacto Ambiental</h2>
                <p className="text-sm text-slate-400">Puntos Totales: <span className="text-amber-400 font-bold">{points} pts</span></p>
              </div>
            </div>
            <button 
              onClick={() => setGamificationModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/30 px-6 overflow-x-auto scrollbar-none">
            <button 
              onClick={() => setActiveTab('actions')}
              className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'actions' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Registrar Acciones
            </button>
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`py-4 px-4 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === 'rewards' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <ShoppingBag size={16} /> Eco-Tienda
            </button>
            <button 
              onClick={() => setActiveTab('badges')}
              className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'badges' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Insignias ({badges.length}/{AVAILABLE_BADGES.length})
            </button>
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'leaderboard' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Liga BGA
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            
            {/* Actions Tab */}
            {activeTab === 'actions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ActionCard 
                    title="Reciclaje en Casa" 
                    desc="Separé mis residuos correctamente hoy." 
                    icon={<Home size={24} />} 
                    points={20} 
                    onClick={() => handleRegisterAction('home')} 
                    color="emerald"
                  />
                  <ActionCard 
                    title="Reciclaje en Universidad" 
                    desc="Usé los puntos ecológicos del campus." 
                    icon={<BookOpen size={24} />} 
                    points={20} 
                    onClick={() => handleRegisterAction('university')} 
                    color="blue"
                  />
                  <ActionCard 
                    title="Reciclaje en el Trabajo" 
                    desc="Fomenté el reciclaje en mi oficina." 
                    icon={<Briefcase size={24} />} 
                    points={20} 
                    onClick={() => handleRegisterAction('work')} 
                    color="purple"
                  />
                  <ActionCard 
                    title="Compartir Logro" 
                    desc="Invité a un amigo a reciclar." 
                    icon={<Share2 size={24} />} 
                    points={15} 
                    onClick={() => handleRegisterAction('share')} 
                    color="pink"
                  />
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-4">Historial Reciente</h3>
                  {registeredActions.length === 0 ? (
                    <p className="text-slate-500 text-sm">Aún no has registrado acciones. ¡Empieza ahora!</p>
                  ) : (
                    <div className="space-y-2">
                      {registeredActions.slice(0, 5).map(action => (
                        <div key={action.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="text-slate-400">
                              {action.type === 'home' && <Home size={16} />}
                              {action.type === 'university' && <BookOpen size={16} />}
                              {action.type === 'work' && <Briefcase size={16} />}
                              {action.type === 'share' && <Share2 size={16} />}
                            </div>
                            <span className="text-sm text-slate-300 capitalize">{
                              action.type === 'home' ? 'Reciclaje en Casa' :
                              action.type === 'university' ? 'Reciclaje en Universidad' :
                              action.type === 'work' ? 'Reciclaje en el Trabajo' : 'Logro Compartido'
                            }</span>
                          </div>
                          <span className="text-sm font-bold text-amber-400">+{action.points} pts</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-amber-400 mb-1 flex items-center gap-2">
                        <ShoppingBag size={20} />
                        Eco-Tienda Local
                      </h3>
                      <p className="text-sm text-slate-300">Canjea tus Puntos de Impacto por cupones de descuento en comercios aliados de Bucaramanga y el área metropolitana.</p>
                      <span className="inline-block mt-3 text-xs bg-slate-900/50 text-slate-400 px-3 py-1 rounded-full border border-slate-700/50">
                        ¿Eres empresa? <a href="#" className="text-cyan-400 font-bold hover:underline">Suma tu negocio aquí</a>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MOCK_REWARDS.map(reward => {
                    const isRedeemed = redeemedRewards.includes(reward.id);
                    const canAfford = points >= reward.cost;
                    
                    return (
                      <div key={reward.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col justify-between">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-3xl">{reward.icon}</span>
                            <span className="bg-slate-900 px-3 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1 border border-amber-500/20">
                              <Tag size={12} /> {reward.cost} pts
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-lg leading-tight mb-1">{reward.title}</h4>
                          <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">{reward.sponsor}</p>
                          <p className="text-slate-400 text-sm">{reward.desc}</p>
                        </div>
                        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
                          {isRedeemed ? (
                            <button disabled className="w-full py-2 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl border border-emerald-500/30">
                              Cupón Adquirido
                            </button>
                          ) : (
                            <button 
                              onClick={() => redeemReward(reward.id, reward.cost)}
                              disabled={!canAfford}
                              className={`w-full py-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                            >
                              {canAfford ? 'Canjear Ahora' : `Te faltan ${reward.cost - points} pts`}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AVAILABLE_BADGES.map(badge => {
                  const isEarned = badges.includes(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`p-5 rounded-2xl border transition-all ${isEarned ? 'bg-slate-800/80 border-slate-600' : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl p-3 rounded-2xl bg-gradient-to-br ${isEarned ? badge.color : 'from-slate-700 to-slate-800'}`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold text-lg mb-1 ${isEarned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{badge.description}</p>
                          {isEarned && (
                            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                              Desbloqueada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mb-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <MapPin size={20} className="text-cyan-400" />
                    Área Metropolitana de Bucaramanga
                  </h3>
                  <p className="text-sm text-slate-400">Compite con otros ciudadanos para ser el mejor reciclador de la ciudad.</p>
                </div>

                <div className="space-y-2">
                  {currentLeaderboard.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border ${user.id === 'me' ? 'bg-cyan-900/30 border-cyan-500/50' : 'bg-slate-800/30 border-slate-700/30'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-yellow-900' :
                          index === 1 ? 'bg-slate-300 text-slate-800' :
                          index === 2 ? 'bg-amber-700 text-amber-100' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className={`font-bold ${user.id === 'me' ? 'text-cyan-400' : 'text-slate-200'}`}>
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">{user.area}</p>
                        </div>
                      </div>
                      <div className="font-black text-amber-400">
                        {user.points} <span className="text-xs font-normal text-slate-500">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ActionCard({ title, desc, icon, points, onClick, color }: { title: string, desc: string, icon: React.ReactNode, points: number, onClick: () => void, color: 'emerald' | 'blue' | 'purple' | 'pink' }) {
  const colorClasses = {
    emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400',
    blue: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400',
    purple: 'hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400',
    pink: 'hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-400',
  }[color];

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-start p-5 rounded-2xl border border-slate-700/50 bg-slate-800/30 transition-all duration-300 text-left group ${colorClasses}`}
    >
      <div className="flex justify-between w-full items-start mb-4">
        <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-slate-900 transition-colors">
          {icon}
        </div>
        <span className="font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-sm">
          +{points} pts
        </span>
      </div>
      <h4 className="font-bold text-white text-lg mb-1">{title}</h4>
      <p className="text-sm text-slate-400">{desc}</p>
    </button>
  );
}

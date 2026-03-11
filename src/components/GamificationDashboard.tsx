import { useAppContext } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Medal, Share2, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function GamificationDashboard() {
  const { userProfile, leaderboard, showGamification, toggleGamification, registerAction, addPoints } = useAppContext();
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionType, setActionType] = useState('casa');

  const handleRegisterAction = (e: React.FormEvent) => {
    e.preventDefault();
    registerAction(actionType);
    setShowActionForm(false);
  };

  const handleShare = () => {
    addPoints(20, 'Compartir logro');
    alert('¡Gracias por compartir! Has ganado 20 puntos.');
  };

  return (
    <AnimatePresence>
      {showGamification && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-0 right-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Tu Progreso
              </h2>
              <button 
                onClick={toggleGamification}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Profile Stats */}
            <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Nivel {userProfile.level}</p>
                  <p className="text-xl font-bold text-gray-900">{userProfile.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-emerald-600">{userProfile.points}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Puntos</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-emerald-200 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(userProfile.points % 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-right text-emerald-700">{100 - (userProfile.points % 100)} pts para el Nivel {userProfile.level + 1}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-8">
              <button 
                onClick={() => setShowActionForm(true)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle2 size={18} />
                Registrar Acción
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Share2 size={18} />
                Compartir
              </button>
            </div>

            {/* Action Form Modal */}
            <AnimatePresence>
              {showActionForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 overflow-hidden"
                >
                  <form onSubmit={handleRegisterAction} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm">¿Qué reciclaste hoy?</h3>
                    <select 
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 mb-3 text-sm"
                    >
                      <option value="casa">Separé residuos en casa</option>
                      <option value="universidad">Usé el punto ecológico en la U</option>
                      <option value="trabajo">Reciclé papel en el trabajo</option>
                      <option value="compost">Hice compostaje</option>
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-emerald-600 text-white py-1.5 rounded text-sm font-medium">Guardar (+50 pts)</button>
                      <button type="button" onClick={() => setShowActionForm(false)} className="flex-1 bg-gray-200 text-gray-800 py-1.5 rounded text-sm font-medium">Cancelar</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Badges */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Medal className="text-purple-500" />
                Insignias
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {userProfile.badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`p-3 rounded-xl border ${badge.unlocked ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200 opacity-60 grayscale'}`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className={`text-xs font-bold ${badge.unlocked ? 'text-purple-900' : 'text-gray-500'}`}>{badge.name}</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="text-yellow-500" />
                Top Recicladores AMB
              </h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.id}
                    className={`flex items-center justify-between p-3 border-b last:border-0 ${entry.id === '4' ? 'bg-emerald-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-bold w-5 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className={`text-sm font-bold ${entry.id === '4' ? 'text-emerald-700' : 'text-gray-800'}`}>{entry.name}</p>
                        <p className="text-[10px] text-gray-500">{entry.location}</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">{entry.points} pts</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
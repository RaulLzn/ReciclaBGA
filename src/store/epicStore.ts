import { create } from 'zustand';

export type ZoneId = 'overview' | 'home' | 'university' | 'processing';

export interface ZoneData {
  id: ZoneId;
  title: string;
  subtitle: string;
  description: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  tips: { id: string; title: string; desc: string; color: string }[];
}

export const ZONES: Record<ZoneId, ZoneData> = {
  overview: {
    id: 'overview',
    title: 'Bucaramanga Metropolitana',
    subtitle: 'Visión General',
    description: 'Descubre cómo funciona el ecosistema de reciclaje en nuestra ciudad. Selecciona una zona para explorar el proceso en detalle.',
    cameraPos: [0, 22, 28],
    targetPos: [0, 0, 0],
    tips: [
      { id: 'o-truck', title: 'Ruta de Recolección', desc: 'Los camiones recorren la ciudad recogiendo el material separado. ¡Haz clic en el camión en movimiento!', color: 'emerald' }
    ]
  },
  home: {
    id: 'home',
    title: 'El Hogar Búcaro',
    subtitle: 'Origen del Reciclaje',
    description: 'Todo comienza en casa. Separar correctamente los residuos es el paso más importante para que el ciclo funcione y los recicladores de oficio puedan hacer su labor.',
    cameraPos: [-12, 8, 14],
    targetPos: [-8, 0, 8],
    tips: [
      { id: 'h-marta', title: 'Doña Marta', desc: 'Marta es una ciudadana ejemplar. Ella separa todo en casa antes de entregarlo. ¡Haz clic en ella!', color: 'pink' },
      { id: 'h-white', title: 'Caneca Blanca', desc: 'Plástico, vidrio, metales, papel y cartón limpios y secos.', color: 'white' },
      { id: 'h-black', title: 'Caneca Negra', desc: 'Papel higiénico, servilletas sucias, papeles metalizados.', color: 'gray' },
      { id: 'h-green', title: 'Caneca Verde', desc: 'Restos de comida, cáscaras, desechos agrícolas.', color: 'green' }
    ]
  },
  university: {
    id: 'university',
    title: 'Campus Universitario',
    subtitle: 'Puntos Ecológicos',
    description: 'En universidades como la UIS o UPB, los puntos ecológicos de alto tráfico requieren mayor conciencia colectiva para no contaminar el material aprovechable.',
    cameraPos: [12, 8, 14],
    targetPos: [8, 0, 8],
    tips: [
      { id: 'u-juan', title: 'Estudiante Juan', desc: 'Juan ayuda a mantener el campus limpio usando los puntos ecológicos. ¡Salúdalo!', color: 'blue' },
      { id: 'u-liquid', title: 'Vacía los líquidos', desc: 'Antes de botar una botella en la caneca blanca, asegúrate de que esté vacía.', color: 'blue' },
      { id: 'u-snack', title: 'Empaques de Snacks', desc: 'Los empaques metalizados (papas, galletas) van a la caneca negra.', color: 'gray' }
    ]
  },
  processing: {
    id: 'processing',
    title: 'ECA (Estación de Clasificación)',
    subtitle: 'Economía Circular',
    description: 'Las cooperativas de recicladores clasifican, pesan y compactan el material para venderlo a la industria transformadora.',
    cameraPos: [0, 10, -2],
    targetPos: [0, 0, -8],
    tips: [
      { id: 'p-carlos', title: 'Reciclador Carlos', desc: 'Carlos clasifica el material en la ECA para que la industria lo pueda transformar.', color: 'orange' },
      { id: 'p-pet', title: 'Pacas de PET', desc: 'El plástico se compacta en grandes bloques para facilitar su transporte.', color: 'yellow' },
      { id: 'p-trans', title: 'Transformación', desc: 'Este material se convertirá en nuevas botellas, ropa o mobiliario urbano.', color: 'emerald' }
    ]
  }
};

export type ActionType = 'home' | 'university' | 'work' | 'share';

export interface RegisteredAction {
  id: string;
  type: ActionType;
  date: string;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const AVAILABLE_BADGES: Badge[] = [
  { id: 'explorer', name: 'Explorador Búcaro', description: 'Encontraste todos los objetos interactivos.', icon: '🔍', color: 'from-blue-400 to-cyan-500' },
  { id: 'plastic_champ', name: 'Campeón del Plástico', description: 'Registraste 5 acciones de reciclaje.', icon: '♻️', color: 'from-emerald-400 to-green-500' },
  { id: 'paper_master', name: 'Maestro del Papel', description: 'Registraste 10 acciones de reciclaje.', icon: '📄', color: 'from-amber-400 to-orange-500' },
  { id: 'influencer', name: 'Eco-Influencer', description: 'Compartiste tus logros 3 veces.', icon: '📢', color: 'from-purple-400 to-pink-500' },
];

export type TutorialStep = 'welcome' | 'navigation' | 'interact' | 'minigame' | 'store';

interface AppState {
  activeZone: ZoneId;
  setActiveZone: (zone: ZoneId) => void;
  points: number;
  discoveredTips: string[];
  discoverTip: (tipId: string) => void;
  animatingId: string | null;
  triggerAnimation: (id: string) => void;
  
  // Tutorial
  seenTutorials: TutorialStep[];
  markTutorialSeen: (step: TutorialStep) => void;
  currentTutorial: TutorialStep | null;
  setCurrentTutorial: (step: TutorialStep | null) => void;

  // Gamification
  isGamificationModalOpen: boolean;
  setGamificationModalOpen: (open: boolean) => void;
  registeredActions: RegisteredAction[];
  registerAction: (type: ActionType) => void;
  badges: string[];
  checkBadges: () => void;
  
  // Economy / Rewards
  redeemedRewards: string[];
  redeemReward: (rewardId: string, cost: number) => boolean;
  
  // Verification
  usedCodes: string[];
  verifyCode: (code: string) => number;

  // Minigame
  isMinigameActive: boolean;
  setMinigameActive: (active: boolean) => void;
  minigameScore: number;
  addMinigameScore: (points: number) => void;
  resetMinigame: () => void;
}

export const useEpicStore = create<AppState>((set, get) => ({
  activeZone: 'overview',
  setActiveZone: (zone) => {
    set({ activeZone: zone });
    const state = get();
    if (zone !== 'overview' && !state.seenTutorials.includes('navigation')) {
      set({ currentTutorial: 'navigation' });
    }
  },
  points: 0,
  discoveredTips: [],
  discoverTip: (tipId) => {
    const state = get();
    if (!state.discoveredTips.includes(tipId)) {
      set({ discoveredTips: [...state.discoveredTips, tipId], points: state.points + 10 });
      get().checkBadges();
      // Show interact tutorial on first interaction
      if (!state.seenTutorials.includes('interact')) {
        set({ currentTutorial: 'interact' });
      }
    }
  },
  animatingId: null,
  triggerAnimation: (id) => {
    set({ animatingId: id });
    setTimeout(() => set({ animatingId: null }), 1500);
  },
  
  // Tutorial
  seenTutorials: [],
  markTutorialSeen: (step) => set((state) => ({ 
    seenTutorials: [...state.seenTutorials, step],
    currentTutorial: null
  })),
  currentTutorial: 'welcome', // Start with welcome tutorial
  setCurrentTutorial: (step) => set({ currentTutorial: step }),

  // Gamification
  isGamificationModalOpen: false,
  setGamificationModalOpen: (open) => {
    set({ isGamificationModalOpen: open });
    const state = get();
    // Show store tutorial if they open the modal, have enough points for the cheapest reward, and haven't seen it
    if (open && state.points >= 50 && !state.seenTutorials.includes('store')) {
       set({ currentTutorial: 'store' });
    }
  },
  registeredActions: [],
  badges: [],
  registerAction: (type) => {
    const pointsAwarded = type === 'share' ? 15 : 20;
    const newAction: RegisteredAction = {
      id: Math.random().toString(36).substring(7),
      type,
      date: new Date().toISOString(),
      points: pointsAwarded
    };
    
    set((state) => ({
      registeredActions: [newAction, ...state.registeredActions],
      points: state.points + pointsAwarded
    }));
    
    get().checkBadges();
  },
  checkBadges: () => {
    const state = get();
    const newBadges = [...state.badges];
    let awarded = false;

    // Explorer badge: all 11 tips discovered
    if (!newBadges.includes('explorer') && state.discoveredTips.length >= 11) {
      newBadges.push('explorer');
      awarded = true;
    }

    // Plastic champ: 5 recycling actions
    const recyclingActions = state.registeredActions.filter(a => a.type !== 'share').length;
    if (!newBadges.includes('plastic_champ') && recyclingActions >= 5) {
      newBadges.push('plastic_champ');
      awarded = true;
    }

    // Paper master: 10 recycling actions
    if (!newBadges.includes('paper_master') && recyclingActions >= 10) {
      newBadges.push('paper_master');
      awarded = true;
    }

    // Influencer: 3 share actions
    const shareActions = state.registeredActions.filter(a => a.type === 'share').length;
    if (!newBadges.includes('influencer') && shareActions >= 3) {
      newBadges.push('influencer');
      awarded = true;
    }

    if (awarded) {
      set({ badges: newBadges });
    }
  },
  
  // Economy / Rewards
  redeemedRewards: [],
  redeemReward: (rewardId, cost) => {
    const state = get();
    if (state.points >= cost && !state.redeemedRewards.includes(rewardId)) {
      set({ 
        points: state.points - cost,
        redeemedRewards: [...state.redeemedRewards, rewardId]
      });
      return true; // Success
    }
    return false; // Not enough points or already redeemed
  },

  // Verification
  usedCodes: [],
  verifyCode: (code) => {
    const state = get();
    const upperCode = code.trim().toUpperCase();
    
    if (!upperCode || state.usedCodes.includes(upperCode)) return 0;
    
    let points = 0;
    if (upperCode === 'BGA-RECICLA-500') points = 500;
    else if (upperCode === 'ECA-BGA-100') points = 100;
    else if (upperCode === 'UNIVERSIDAD-200') points = 200;

    if (points > 0) {
      set({ 
        points: state.points + points, 
        usedCodes: [...state.usedCodes, upperCode] 
      });
      return points;
    }
    return 0;
  },

  // Minigame
  isMinigameActive: false,
  setMinigameActive: (active) => {
    set({ isMinigameActive: active });
    const state = get();
    if (active && !state.seenTutorials.includes('minigame')) {
      set({ currentTutorial: 'minigame' });
    }
  },
  minigameScore: 0,
  addMinigameScore: (points) => set((state) => ({ minigameScore: state.minigameScore + points, points: state.points + points })),
  resetMinigame: () => set({ minigameScore: 0 }),
}));

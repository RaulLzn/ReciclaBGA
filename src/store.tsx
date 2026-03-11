import React, { createContext, useContext, useState, useEffect } from "react";
import { StageId, InfoItem, UserProfile, Badge, LeaderboardEntry } from "./types";
import { STAGES } from "./constants";

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Explorador', description: 'Descubre tu primer punto de información', icon: '🔍', unlocked: false },
  { id: 'b2', name: 'Campeón del Plástico', description: 'Aprende sobre el reciclaje de plástico', icon: '🥤', unlocked: false },
  { id: 'b3', name: 'Maestro del Papel', description: 'Aprende sobre el reciclaje de papel', icon: '📄', unlocked: false },
  { id: 'b4', name: 'Héroe de Bucaramanga', description: 'Completa todo el recorrido 3D', icon: '🦸', unlocked: false },
  { id: 'b5', name: 'Acción Real', description: 'Registra tu primera acción de reciclaje', icon: '♻️', unlocked: false },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Ana M.', points: 1250, location: 'Cabecera' },
  { id: '2', name: 'Carlos G.', points: 980, location: 'Floridablanca' },
  { id: '3', name: 'Laura R.', points: 850, location: 'Piedecuesta' },
  { id: '4', name: 'Tú', points: 0, location: 'Bucaramanga' },
  { id: '5', name: 'Diego S.', points: 420, location: 'Girón' },
];

interface AppState {
  currentStageIndex: number;
  activeInfo: InfoItem | null;
  userProfile: UserProfile;
  leaderboard: LeaderboardEntry[];
  showGamification: boolean;
  setStageIndex: (index: number) => void;
  setActiveInfo: (info: InfoItem | null) => void;
  nextStage: () => void;
  prevStage: () => void;
  addPoints: (points: number, reason: string) => void;
  registerAction: (actionType: string) => void;
  toggleGamification: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [activeInfo, setActiveInfo] = useState<InfoItem | null>(null);
  const [showGamification, setShowGamification] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Tú',
    points: 0,
    level: 1,
    badges: INITIAL_BADGES,
    discoveredItems: [],
  });
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

  // Check for level ups and badges whenever points or discovered items change
  useEffect(() => {
    let updatedProfile = { ...userProfile };
    let changed = false;

    // Level up logic (every 100 points)
    const newLevel = Math.floor(updatedProfile.points / 100) + 1;
    if (newLevel > updatedProfile.level) {
      updatedProfile.level = newLevel;
      changed = true;
    }

    // Badge logic
    const unlockBadge = (id: string) => {
      const badgeIndex = updatedProfile.badges.findIndex(b => b.id === id);
      if (badgeIndex !== -1 && !updatedProfile.badges[badgeIndex].unlocked) {
        updatedProfile.badges[badgeIndex].unlocked = true;
        changed = true;
        // Add bonus points for badge
        updatedProfile.points += 50;
      }
    };

    if (updatedProfile.discoveredItems.length >= 1) unlockBadge('b1');
    if (updatedProfile.discoveredItems.includes('white-bin') || updatedProfile.discoveredItems.includes('public-white')) unlockBadge('b2');
    if (updatedProfile.discoveredItems.includes('black-bin') || updatedProfile.discoveredItems.includes('public-black')) unlockBadge('b3');
    if (updatedProfile.discoveredItems.length >= 8) unlockBadge('b4');

    if (changed) {
      setUserProfile(updatedProfile);
      
      // Update leaderboard
      setLeaderboard(prev => {
        const newLb = [...prev];
        const userIndex = newLb.findIndex(entry => entry.id === '4');
        if (userIndex !== -1) {
          newLb[userIndex].points = updatedProfile.points;
        }
        return newLb.sort((a, b) => b.points - a.points);
      });
    }
  }, [userProfile.points, userProfile.discoveredItems.length]);

  const addPoints = (points: number, reason: string) => {
    setUserProfile(prev => ({
      ...prev,
      points: prev.points + points
    }));
    // In a real app, we might show a toast notification here with the reason
  };

  const setActiveInfoWithGamification = (info: InfoItem | null) => {
    setActiveInfo(info);
    
    if (info && !userProfile.discoveredItems.includes(info.id)) {
      setUserProfile(prev => ({
        ...prev,
        points: prev.points + (info.points || 10),
        discoveredItems: [...prev.discoveredItems, info.id]
      }));
    }
  };

  const registerAction = (actionType: string) => {
    addPoints(50, `Acción registrada: ${actionType}`);
    
    // Unlock action badge
    setUserProfile(prev => {
      const newProfile = { ...prev };
      const badgeIndex = newProfile.badges.findIndex(b => b.id === 'b5');
      if (badgeIndex !== -1 && !newProfile.badges[badgeIndex].unlocked) {
        newProfile.badges[badgeIndex].unlocked = true;
        newProfile.points += 50; // Bonus for badge
      }
      return newProfile;
    });
  };

  const setStageIndex = (index: number) => {
    if (index >= 0 && index < STAGES.length) {
      setCurrentStageIndex(index);
      setActiveInfo(null);
    }
  };

  const nextStage = () => setStageIndex(currentStageIndex + 1);
  const prevStage = () => setStageIndex(currentStageIndex - 1);
  const toggleGamification = () => setShowGamification(!showGamification);

  return (
    <AppContext.Provider
      value={{
        currentStageIndex,
        activeInfo,
        userProfile,
        leaderboard,
        showGamification,
        setStageIndex,
        setActiveInfo: setActiveInfoWithGamification,
        nextStage,
        prevStage,
        addPoints,
        registerAction,
        toggleGamification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};

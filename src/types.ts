export type StageId = "home" | "public" | "collection" | "processing";

export interface StageData {
  id: StageId;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export interface InfoItem {
  id: string;
  title: string;
  content: string;
  type: "good" | "bad" | "info";
  points?: number;
  position?: [number, number, number];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserProfile {
  name: string;
  points: number;
  level: number;
  badges: Badge[];
  discoveredItems: string[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  location: string;
}

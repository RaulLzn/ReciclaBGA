import { EpicExperience } from "./components/EpicExperience";
import { EpicUI } from "./components/EpicUI";
import { GamificationModal } from "./components/GamificationModal";
import { MinigameUI } from "./components/MinigameUI";

export default function App() {
  return (
    <div className="w-screen h-screen bg-slate-950 overflow-hidden relative font-sans">
      <EpicExperience />
      <EpicUI />
      <GamificationModal />
      <MinigameUI />
    </div>
  );
}

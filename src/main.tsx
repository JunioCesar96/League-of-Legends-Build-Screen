
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
//import "./index.css";   // tailwind
import "./styles/custom.css";  // suas coisas
import { passiveVideoView } from "./components/PassiveVideoView";


(window as any).passiveVideoView = passiveVideoView;
createRoot(document.getElementById("root")!).render(<App />);


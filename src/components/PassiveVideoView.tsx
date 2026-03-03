import passiveDataJson from "../data/passiveVideo.json";
import { YouTubeVideoInfo } from "./YouTubeVideoInfo";
import { findParentVideoHide} from "./utils/dom";
import {showVideoViewer} from "./utils/functions_VideoViewer";

type PassiveVideoMap = Record<string, {
    id_video: string;
    fkjtled: number;
}>;

const passiveData = passiveDataJson as PassiveVideoMap;

export function passiveVideoView(passiveName: string, passiveElement: HTMLElement) {
    
    // Só troca o vídeo se a div_video_hide existir e estiver visível
    const container = findParentVideoHide(passiveElement);
    showVideoViewer(container!);
    if (!container) {
        console.warn("❌ div_video_hide não encontrada ou invisível!");
        return;
    }



    container.innerHTML = "";

    const data = passiveData[passiveName];

    if (!data?.id_video) {
        container.innerHTML = `<p style="color:red">Vídeo não encontrado para ${passiveName}</p>`;
        return;
    }

    import("react-dom").then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(<YouTubeVideoInfo videoId={data.id_video} autoPlay={true} />);
    });
}

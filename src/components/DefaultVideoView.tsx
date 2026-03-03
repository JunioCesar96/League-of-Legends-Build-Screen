import { YouTubeVideoInfo } from "./YouTubeVideoInfo";
import { findParentVideoHide } from "./utils/dom";
import {showVideoViewer} from "./utils/functions_VideoViewer";

export function DefaultVideoView(videoId: string, defualtElement: HTMLElement) {

    showVideoViewer(defualtElement);

    // Só troca o vídeo se a div_video_hide existir e estiver visível
    const container = findParentVideoHide(defualtElement);
    if (!container) {
        console.warn("❌ div_video_hide não encontrada ou invisível!");
        return;
    }

    container.innerHTML = "";

    if (!videoId) {
        container.innerHTML = `<p style="color:red">Vídeo não encontrado para ${videoId}</p>`;
        return;
    }

    import("react-dom").then(({ createRoot }) => {
        const root = createRoot(container);
        root.render(<YouTubeVideoInfo videoId={videoId} autoPlay={true} />);
    });
}

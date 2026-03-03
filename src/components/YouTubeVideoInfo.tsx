import { useEffect, useRef, useState } from "react";
import { getVideoDetails } from "../api/YouTubeAPI";

interface YouTubeVideoInfoProps {
    videoId?: string;
    autoPlay?: boolean;
    mute?: boolean;
    controls?: boolean;
    loop?: boolean;
}

export function YouTubeVideoInfo({
    videoId,
    autoPlay = false,
    mute = false,
    controls = true,
    loop = false
}: YouTubeVideoInfoProps) {

    const [info, setInfo] = useState<any>(null);

    // ⭐ controla se o vídeo está em fullscreen
    const [isFullScreen, setIsFullScreen] = useState(false);

    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (videoId) {
            loadVideoData(videoId);
        }
    }, [videoId]);

    async function loadVideoData(id: string) {
        try {
            const data = await getVideoDetails(id);
            setInfo(data);
        } catch (err) {
            console.error("Erro ao carregar dados do vídeo:", err);
        }
    }

    // ⭐ DETECTAR ESC OU F11 usando fullscreenchange ou F
    useEffect(() => {
        const handler = () => {
            const isNowFullscreen = !!document.fullscreenElement;
            setIsFullScreen(isNowFullscreen);

            // Remove a classe quando sair do fullscreen
            if (!isNowFullscreen && videoRef.current) {
                videoRef.current.classList.remove("fullscreenvideo");
            }
        };

        function handleKey(e: KeyboardEvent) {
            if (e.key === "f" || e.key === "F") {
                fullscreenvideo();
            }
        }

        document.addEventListener("keydown", handleKey);
        document.addEventListener("fullscreenchange", handler);

        // 👍 aqui é o único return
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("fullscreenchange", handler);
        };
    }, []);


    if (!info?.id) return null;

    const params = new URLSearchParams({
        autoplay: autoPlay ? "1" : "0",
        controls: controls ? "1" : "0",
        mute: mute ? "1" : "0",
    });

    const src = `https://www.youtube.com/embed/${info.id}?${params.toString()}`;

    // ⭐ FULLSCREEN pelo botão
    function fullscreenvideo() {
        if (!videoRef.current) return;

        const element = videoRef.current;

        if (!document.fullscreenElement) {
            element.requestFullscreen()
                .catch(err => console.error("Erro ao entrar no fullscreen:", err));
        } else {
            document.exitFullscreen()
                .catch(err => console.error("Erro ao sair do fullscreen:", err));
        }

        element.classList.toggle("fullscreenvideo");
    }


    // ⭐ botão fullscreen
    const fullScreenButton = (
        <div
            className="fullbtnvideo"
            title={isFullScreen ? "Sair da tela cheia" : "Ver vídeo em tela cheia"}
            onClick={fullscreenvideo}
            style={{
                backgroundImage: isFullScreen
                    ? 'url("../public/img/btn_exit_full_screen_video.svg")'
                    : 'url("../public/img/btn_full_screen_video.svg")',
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                cursor: "pointer"
            }}
        />
    );

    const iframe = (
        <iframe
            src={src}
            allow="autoplay"
            width="100%"
            height="100%"
            style={{ border: 0 }}
        />
    );

    const video = (
        <div className="video" ref={videoRef}>
            {fullScreenButton}
            {iframe}
        </div>
    );

    return video;
}

import { useEffect } from "react";
import { DefaultVideoView } from "../DefaultVideoView";
import { showVideoViewer, autoPlayVideo, trueAutoplay } from "../utils/functions_VideoViewer";

const VideoViewer = () => {
  useEffect(() => {
    // wrapper para ícone + progresso
    const wrapper = document.createElement("div");
    wrapper.id = "icon-view-wrapper";
    wrapper.style.position = "absolute";
    wrapper.style.top = "50%";
    wrapper.style.left = "50%";
    wrapper.style.transform = "translate(-50%, -50%)";
    wrapper.style.pointerEvents = "none";

    // SVG circular de progresso
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    const size = 28;
    svg.setAttribute("width", `${size}px`);
    svg.setAttribute("height", `${size}px`);
    svg.setAttribute("viewBox", "0 0 100 100");  // coordenadas para o círculo

    const bgCircle = document.createElementNS(ns, "circle");
    bgCircle.setAttribute("cx", "50");
    bgCircle.setAttribute("cy", "50");
    bgCircle.setAttribute("r", "45");
    bgCircle.setAttribute("fill", "none");
    bgCircle.setAttribute("stroke", "#003441ff");      // cor de fundo da barra
    bgCircle.setAttribute("stroke-width", "10");

    const progressCircle = document.createElementNS(ns, "circle");
    progressCircle.setAttribute("cx", "50");
    progressCircle.setAttribute("cy", "50");
    progressCircle.setAttribute("r", "45");
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke", "rgba(0, 195, 255, 1)"); // cor do progresso
    progressCircle.setAttribute("stroke-width", "14");
    progressCircle.setAttribute("stroke-linecap", "round");

    // Para animação via stroke-dasharray/dashoffset
    const circumference = 2 * Math.PI * 45;
    progressCircle.setAttribute("stroke-dasharray", `${circumference}`);
    progressCircle.setAttribute("stroke-dashoffset", `${circumference}`);

    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);

    // Ícone play (mesmo SVG que você tinha)
    const icon = document.createElement("div");
    icon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" transform="scale(1,-1)"
    viewBox="0 0 24 24" fill="#003441ff">

    
    <!-- Círculo externo -->
    <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="none"></circle>

    <!-- Ícone de olho (convertido + posicionado + escalado) -->
    
    <g transform="translate(12,12) scale(0.03) translate(-320,-320)" fill="#a8c9e4ff">
         <g xmlns="http://www.w3.org/2000/svg" transform="translate(-160,-160) scale(1.5)" fill="#022027ff" stroke="none">
       <path d="M248 577 c-172 -49 -250 -264 -147 -406 98 -136 275 -156 398 -45 115 103 115 285 -1 389 -70 64 -162 86 -250 62z"/>
    </g>
     <g xmlns="http://www.w3.org/2000/svg" transform="translate(50%,50%) scale(2)" fill="#a8c9e4ff" stroke="none">
       <path d="M248 577 c-172 -49 -250 -264 -147 -406 98 -136 275 -156 398 -45 115 103 115 285 -1 389 -70 64 -162 86 -250 62z"/>
    </g>
      <path fill"#00ccffff"  d="M250 571 c-80 -26 -159 -102 -206 -197 l-26 -54 26 -54 c34 -69 107 -151 160 -179 58 -30 174 -30 232 0 53 28 126 110 160 179 l26 54 -26 54 c-34 70 -107 151 -160 178 -44 22 -145 33 -186 19z m186 -67 c61 -37 104 -113 104 -184 0 -103 -87 -203 -188 -217 -170 -23 -302 151 -232 305 56 123 201 168 316 96z"/>
     <g xmlns="http://www.w3.org/2000/svg" transform="translate(50%,50%) scale(2)" fill="#000000ff" stroke="none">
      <path d="M271 406 c-47 -26 -63 -84 -37 -135 35 -66 137 -66 172 0 23 45 18 59 -20 59 -44 0 -52 14 -31 47 14 21 15 27 4 34 -20 13 -60 10 -88 -5z"/>
      </g>
      

    </g>
  </svg>
`;

    icon.style.position = "absolute";
    icon.style.top = "50%";
    icon.style.left = "50%";
    icon.style.transform = "translate(-50%, -50%)";


    progressCircle.setAttribute("stroke-dashoffset", `${0}`);

    wrapper.appendChild(svg);
    wrapper.appendChild(icon);


    let currentElem: HTMLElement | null = null;
    let progressInterval: number | null = null;

    function statesVideo(videoDiv: HTMLElement) {
      if (!videoDiv) {
        return { error: "videoDiv inválido" };
      }

      // Detecta elemento <video> ou <iframe>
      const video = videoDiv.querySelector("video") as HTMLVideoElement | null;
      const iframe = videoDiv.querySelector("iframe") as HTMLIFrameElement | null;

      // 📌 Caso seja <video> HTML5
      if (video) {
        const isPaused = video.paused;
        const isPlaying = !video.paused && !video.ended;
        const isMuted = video.muted;
        const hasControls = video.controls;
        const duration = video.duration || 0;
        const current = video.currentTime || 0;

        return {
          type: "html5-video",
          url: video.currentSrc,
          playing: isPlaying,
          paused: isPaused,
          ended: video.ended,
          loading: video.readyState < 3,
          duration: duration,
          currentTime: current,
          progressPercent: duration ? Number(((current / duration) * 100).toFixed(2)) : 0,
          volume: video.volume,
          muted: isMuted,
          loop: video.loop,
          autoplay: video.autoplay,
          playbackRate: video.playbackRate,
          controlsVisible: hasControls,
          resolution: {
            width: video.videoWidth,
            height: video.videoHeight
          },
          fullscreen:
            document.fullscreenElement === video ||
            (document as any).webkitFullscreenElement === video,
        };
      }

      // 📌 Caso seja IFRAME (YouTube, Vimeo, etc.)
      if (iframe) {
        let autoplay = iframe.src.includes("autoplay=1");
        let muted = iframe.src.includes("mute=1");
        let controls = !iframe.src.includes("controls=0");

        return {
          type: "iframe-video",
          url: iframe.src,
          autoplay,
          muted,
          controlsVisible: controls,
          // Iframes não permitem tempo/duração sem API externa
          duration: "unknown (requires YouTube/Vimeo API)",
          currentTime: "unknown (requires API)",
          playing: "unknown (requires API)",
          paused: "unknown (requires API)",
          progressPercent: "unknown (requires API)"
        };
      }

      return { error: "Nenhum vídeo encontrado dentro de videoDiv" };
    }

    const total = 3;  // segundos de duração
    const startProgress = (elem: HTMLElement) => {
      elem.appendChild(wrapper);
      wrapper.style.display = "block";

      const startTime = performance.now();

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      progressInterval = window.setInterval(() => {
        const now = performance.now();
        const elapsedSeconds = (now - startTime) / 1000;

        const pct = Math.min(elapsedSeconds / total, 1); // progressão real
        const offset = circumference * (1 - pct);

        progressCircle.setAttribute("stroke-dashoffset", `${offset}`);

        if (pct >= 1) {
          clearInterval(progressInterval!);
          hideIcon();
          console.log(currentElem)
          // Carregar o vídeo
          const vidId = getVideoId(elem);
          const pElem = getElementVideoDiv(elem);
          DefaultVideoView(vidId!, pElem!);
        }
      }, 1000 / 60); // 60 FPS
    };



    function falseAutoplay(src: string): string {
      // 1 — Se já existe autoplay
      if (src.includes("autoplay=")) {
        // substitui 0 → 1
        return src.replace(/autoplay=1/g, "autoplay=0");
      }

      // 2 — Não existe autoplay → adicionar corretamente
      const separator = src.includes("?") ? "&" : "?";
      return src + `${separator}autoplay=0`;
    }



    const autoPauseVideo = (videoDiv: HTMLElement) => {
      const iframe = videoDiv.querySelector("iframe") as HTMLIFrameElement;
      if (iframe) {
        const src = iframe.src;
        iframe.src = falseAutoplay(src);
      }
    };


    const VideoViewerOpen = (currentElem: HTMLElement) => {
      if (!currentElem) return;

      // 1 — procurar o filho com id="mouse-follower"
      const mouseFollower = currentElem.querySelector("#mouse-follower") as HTMLElement;
      if (!mouseFollower) return;

      // 2 — procurar a div que atualmente possui class="div_video"
      const videoDiv = mouseFollower.querySelector(
        'div.div_video[data-text="VIDEO"]'
      ) as HTMLElement;

      return (videoDiv ? true : false);
    }

    const getVideoId = (elem: HTMLElement): string | null => {
      if (!elem) return null;

      // procura qualquer elemento dentro de elem que tenha o atributo video-id
      const videoEl = elem.querySelector("[video-id]") as HTMLElement | null;

      return videoEl?.getAttribute("video-id") ?? null;
    };

    const getElementVideoDiv = (elem: HTMLElement): HTMLElement | null => {
      if (!elem) return null;

      const mouseFollower = elem.querySelector("#mouse-follower");
      if (!mouseFollower) return null;

      // seletor correto ↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      const videoElement = mouseFollower.querySelector("[video-id]") as HTMLElement | null;

      return videoElement;
    };






    const hideVideoViewer = (currentElem: HTMLElement) => {
      if (!currentElem) return;

      // 🔍 Garantir que sempre chegamos ao elemento 'item'
      let current: HTMLElement | null = currentElem;

      while (current && current.id !== "item") {
        current = current.parentElement;
      }

      if (!current) {
        console.warn("Elemento 'item' não encontrado na hierarquia.");
        return;
      }

      // Agora current é o elemento "item"
      const mouseFollower = current.querySelector("#mouse-follower") as HTMLElement;
      if (!mouseFollower) return;

      const videoDiv = mouseFollower.querySelector(
        'div.div_video[data-text="VIDEO"]'
      ) as HTMLElement;

      if (!videoDiv) return;

      const parent = currentElem?.parentElement;
      if (parent && !parent.classList.contains("clicked")) {
        autoPauseVideo(videoDiv);
        videoDiv.classList.remove("div_video");
        videoDiv.classList.add("div_video_hide");
      }

    };



    const hideIcon = () => {
      if (wrapper.parentElement) {
        wrapper.parentElement.removeChild(wrapper);
      }
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
    };

    const handleEnter = (event: Event) => {
      const target = event.target as HTMLElement;

      if (["item", "img_item"].includes(target.id)) {

        currentElem = target;
        const elemForAppend = target.id === "item" ? target : (target.parentElement as HTMLElement);
        if (VideoViewerOpen(elemForAppend)) return;
        setTimeout(() => {
          startProgress(elemForAppend);
        }, 100);

        return true;
      }
    };

    let click = false;
    let elem_clicked: HTMLElement[] = [];


    const handleLeave = (event: Event) => {
      const target = event.target as HTMLElement;
      // IDs válidos
      const validIds = ["item", "img_item", "mouse-follower"];

      // Se o elemento atual é o mesmo e está clicado
      //para ignorar os elementos adicione && !target.closest('#item, #img_item, #mouse-follower')
      if (!validIds.includes(target.id)) {
        const item_clicked = document.querySelectorAll('#item');
        item_clicked.forEach(el => {
          const elem_clicked_target = el as HTMLElement;
          const elem_clicked_parent = elem_clicked_target;
          const elem_clicked_follower = elem_clicked_parent.querySelector('#mouse-follower') as HTMLElement;
          hideIcon();
          hideVideoViewer(elem_clicked_follower);
          currentElem = null;
          return true;
        })
      }


    };









    const mouseClick = (event: MouseEvent) => {

      let target = event.target as HTMLElement;
      // Determina o elemento pai que receberá a classe "clicked"
      if (target.parentElement!.id === "item" || target.id === "item") {
        target = target.parentElement!;
      }
      const parent = target.id === "img_item" ? target.parentElement! : target;
      const follower = parent.querySelector('#mouse-follower') as HTMLElement;
      const div_img_item = parent.querySelector('#img_item') as HTMLElement;

      // IDs válidos
      const validIds = ["item", "img_item", "mouse-follower"];

      // 1️⃣ Clique fora de qualquer item válido → fechar todas as views
      if (!validIds.includes(target.id) && !target.closest('#item, #img_item, #mouse-follower')) {
        const items = document.querySelectorAll('#item');
        items.forEach(item => {
          const itemParent = item as HTMLElement;
          const img_item = itemParent.querySelector('#img_item') as HTMLElement;
          item.classList.remove("clicked");
          img_item?.classList.remove("fx_clicked");

          const followerEl = item.querySelector('#mouse-follower') as HTMLElement;
          if (followerEl) {
            followerEl.classList.remove("itemDataViewClicked");
            hideVideoViewer(followerEl);
          }
        });

        elem_clicked = [];
      }

      // 2️⃣ Clique em item ou img_item
      if (target.id === "img_item" || target.id === "item") {

        // Se o pai já está clicado → desmarcar
        if (elem_clicked.includes(parent)) {
          parent.classList.remove("clicked");
          div_img_item?.classList.remove("fx_clicked");

          if (follower) {
            follower.classList.remove("itemDataViewClicked");
            hideVideoViewer(follower);
          }

          // Remove do array de clicados
          elem_clicked = elem_clicked.filter(el => el !== parent);
          return true;
        }

        // Desmarcar todos os antigos
        elem_clicked.forEach(el => {
          el.classList.remove("clicked");
          const oldImgItem = el.querySelector('#img_item') as HTMLElement;
          oldImgItem?.classList.remove("fx_clicked");

          const oldFollower = el.querySelector('#mouse-follower') as HTMLElement;
          if (oldFollower) {
            oldFollower.classList.remove("itemDataViewClicked");
            hideVideoViewer(oldFollower);
          }
        });
        elem_clicked = [];

        // Marcar o novo pai
        parent.classList.add("clicked");
        div_img_item?.classList.add("fx_clicked");

        if (follower) follower.classList.add("itemDataViewClicked");

        // Adicionar ao array de clicados
        elem_clicked.push(parent);

        return true;
      }

    };






    document.addEventListener("click", mouseClick, true);

    document.addEventListener("mouseenter", handleEnter, true);
    document.addEventListener("mouseleave", handleLeave, true);

    return () => {
      document.removeEventListener("mouseenter", handleEnter, true);
      document.removeEventListener("mouseleave", handleLeave, true);
      hideIcon();
    };
  }, []);

  return null;
};

export default VideoViewer;

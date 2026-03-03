        function trueAutoplay(src: string): string {
      // 1 — Se já existe autoplay
      if (src.includes("autoplay=")) {
        // substitui 0 → 1
        return src.replace(/autoplay=0/g, "autoplay=1");
      }

      // 2 — Não existe autoplay → adicionar corretamente
      const separator = src.includes("?") ? "&" : "?";
      return src + `${separator}autoplay=1`;
    }

    const autoPlayVideo = (videoDiv: HTMLElement) => {
      const iframe = videoDiv.querySelector("iframe") as HTMLIFrameElement;
      if (iframe) {
        const src = iframe.src;
        iframe.src = trueAutoplay(src);
      }
    };
    
    const showVideoViewer = (elem: HTMLElement) => {
      if (!elem) return;

      if(elem.id !== "img_item"){
        console.log("elem não é img_item:");
        console.log(elem)
      };



      // 🔍 Garantir que sempre chegamos ao elemento 'item'
      let current: HTMLElement | null = elem;

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
        'div.div_video_hide[data-text="VIDEO"]'
      ) as HTMLElement;

      if (!videoDiv) return;

      videoDiv.classList.remove("div_video_hide");
      autoPlayVideo(videoDiv);
      videoDiv.classList.add("div_video");

    };

    export { showVideoViewer, autoPlayVideo, trueAutoplay };

// Retorna a div_video_hide dentro do mouse-follower apenas se o mouse-follower estiver visível
export function findMouseFollower(el: HTMLElement): HTMLElement | null {
    let parent: HTMLElement | null = el;

    while (parent) {
        if (parent.id === "mouse-follower") {
            // Verifica se está visível
            const style = window.getComputedStyle(parent);
            if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) {
                return null;
            }

            // Procura a div_video_hide
            const videoDiv = parent.querySelector(".div_video_hide") as HTMLElement;
            if (videoDiv) return videoDiv;

            // Se não tiver, tenta div_video
            const altDiv = parent.querySelector(".div_video") as HTMLElement;
            return altDiv ?? null;
        }

        parent = parent.parentElement;
    }

    return null;
}

// Retorna a div_video_hide se existir e estiver visível
export function findParentVideoHide(el: HTMLElement): HTMLElement | null {
    const container = findMouseFollower(el);
    if (!container) return null;

    const style = window.getComputedStyle(container);
    if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) {
        return null;
    }

    return container;
}

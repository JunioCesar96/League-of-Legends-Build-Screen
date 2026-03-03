import { useEffect } from "react";

const MouseFollower = () => {
  useEffect(() => {
    let currentElem: HTMLElement | null = null;

    const foolower = (event: MouseEvent, currentElem: HTMLElement) => {
      let followerHeight = 0;
      let followerWidth = 0;

      const MIN = 8;
      const HEIGTH_BEFORE = 26;

      const rect = currentElem.getBoundingClientRect();
      const relativeY = event.clientY - rect.top - HEIGTH_BEFORE / 2;

      let follower: HTMLElement | null = null;
      let group_items_type: HTMLElement | null = null;

      // ---------------------------------------------------------
      // ENCONTRAR O ELEMENTO #mouse-follower
      // ---------------------------------------------------------
      if (currentElem.id === "item") {
        follower = currentElem.querySelector("#mouse-follower");
      } else if (currentElem.id === "img_item") {
        const parentElem = currentElem.parentElement;
        if (parentElem) follower = parentElem.querySelector("#mouse-follower");
      }

      if (!follower) return;

      followerHeight = follower.offsetHeight;
      followerWidth = follower.offsetWidth;

      group_items_type = follower.parentElement;

      if (group_items_type) {
        group_items_type = group_items_type.parentElement;

        if (group_items_type?.id === "item") {
          while (
            group_items_type &&
            group_items_type.id !== "group-items-builder-editor"
          ) {
            group_items_type = group_items_type.parentElement;
          }
        }

        const MAX = followerHeight - (MIN + HEIGTH_BEFORE);

        if (
          (currentElem.id === "item" || currentElem.id === "img_item") &&
          relativeY >= MIN &&
          relativeY <= MAX
        ) {
          // ---------------------------------------------------------
          // PEGAR OS CONTAINERS PRINCIPAIS
          // ---------------------------------------------------------
          const group_items_builder_view = document.getElementById(
            "group-items-builder-view"
          );
          const group_items_selector = document.getElementById(
            "group-items-selector"
          );
          const group_items_builder_editor = document.getElementById(
            "group-items-builder-editor"
          );

          let metade_group_items = 0;

          if (group_items_builder_view) {
            metade_group_items =
              Math.min(group_items_builder_view.offsetWidth, window.innerWidth) /
              2;
          } else if (group_items_builder_editor && group_items_type) {
            if (group_items_builder_editor.id === group_items_type.id) {
              metade_group_items =
                Math.min(
                  group_items_builder_editor.offsetWidth,
                  window.innerWidth
                ) / 2;
            } else if (group_items_selector) {
              if (group_items_selector.id === group_items_type.id) {
                metade_group_items =
                  Math.min(group_items_selector.offsetWidth, window.innerWidth) /
                  2;
              }
            }
          } else return;

          // ---------------------------------------------------------
          // LIMITE DA TELA
          // ---------------------------------------------------------
          const telaWidth = window.innerWidth - metade_group_items - followerWidth - 64;
          const telaHeight = window.innerHeight - (followerHeight - 24);

          // ---------------------------------------------------------
          // POSICIONAMENTO EM X DO BALÃO
          // ---------------------------------------------------------
          let side_x: "right" | "left" = "right";

          const pos_btn_follower_x = (side: "right" | "left") => {
            switch (side) {
              case "left":
                document.documentElement.style.setProperty(
                  "--mouse-x-follower-before",
                  `${-17 + followerWidth}px`
                );
                document.documentElement.style.setProperty(
                  "--rotate-mouse-follower-before",
                  `${180 + 45}deg`
                );
                break;
              case "right":
              default:
                document.documentElement.style.setProperty(
                  "--mouse-x-follower-before",
                  `-13px`
                );
                document.documentElement.style.setProperty(
                  "--rotate-mouse-follower-before",
                  `45deg`
                );
                break;
            }
          };

          const pos_follower_x = (event: MouseEvent) => {
            if (event.clientX > telaWidth) {
              side_x = "left";
              document.documentElement.style.setProperty(
                "--x-follower",
                `${((105 * 2.2) + followerWidth) * -1}%`
              );
            } else {
              side_x = "right";
              document.documentElement.style.setProperty("--x-follower", `105%`);
            }
          };

          pos_follower_x(event);
          pos_btn_follower_x(side_x);


          // ---------------------------------------------------------
          // POSICIONAMENTO EM Y DO BALÃO
          // ---------------------------------------------------------
          let side_y: "up" | "down" = "down";

          const pos_btn_follower_y = (side: "up" | "down", relativeY: number) => {
            let result = 0;
            switch (side) {
              case "down":
                // Pivo do Balão invertido (para cima)
                result = ((followerHeight - (relativeY * -1)) - 64 - (HEIGTH_BEFORE / 2) - MIN);
                document.documentElement.style.setProperty("--mouse-y-follower-before", `${result}px`);
                break;

              case "up":
                // pivo do Balão padrão (para baixo)
                result = relativeY;
                document.documentElement.style.setProperty("--mouse-y-follower-before", `${result}px`);
                break;

              default:
                result = relativeY;
                document.documentElement.style.setProperty("--mouse-y-follower-before", `${result}px`);
                break;
            }
            document.documentElement.style.setProperty("--rotate-follower", `0deg`);
          };

          const pos_follower_y = (clientY: number) => {
            if (clientY > telaHeight) {
              side_y = "down";
              document.documentElement.style.setProperty("--y-follower", `-${followerHeight}px`);
            } else {
              side_y = "up";
              document.documentElement.style.setProperty("--y-follower", `-100%`);
            }
          };

          // Chamadas
          pos_follower_y(event.clientY);
          pos_btn_follower_y(side_y, relativeY);

        }
      }
    };

    const handleOver = (event: Event) => {
      currentElem = event.target as HTMLElement;
    };

    const handleMove = (event: MouseEvent) => {
      if (!currentElem) return;
      foolower(event, currentElem);
    };

    const handleEnter = (event: Event) => {
      foolower(event as MouseEvent, currentElem!);
    }

    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, []);

  return null;
};

export default MouseFollower;

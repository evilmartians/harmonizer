import type { CSSProperties, PropsWithChildren } from "react";

import { useSubscribe } from "@spred/react";

import { useScrollbarSize } from "@core/hooks/useScrollbarSize";
import { $hueIds, $levelIds } from "@core/stores/colors";
import { $bgColorDark, $bgColorLight, $bgLightStart } from "@core/stores/settings";

import styles from "./MainContainer.module.css";

type MainContainerProps = PropsWithChildren;

export function MainContainer({ children }: MainContainerProps) {
  const levels = useSubscribe($levelIds);
  const hues = useSubscribe($hueIds);
  const bgDark = useSubscribe($bgColorDark);
  const bgLight = useSubscribe($bgColorLight);
  const bgLightStart = useSubscribe($bgLightStart);
  const scrollbarSize = useScrollbarSize();

  return (
    <div
      className={styles.container}
      style={
        {
          "--bg-dark": bgDark,
          "--bg-light": bgLight,
          "--bg-light-started-at": bgLightStart,
          "--grid-levels": levels.length,
          "--grid-hues": hues.length,
          "--scrollbar-size": `${scrollbarSize}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

import type { CSSProperties, PropsWithChildren } from "react";

import { useSubscribe } from "@spred/react";

import { useScrollbarSize } from "@core/hooks/useScrollbarSize";
import { $hueIds, $levelIds } from "@core/stores/colors";
import { $bgColorLeft, $bgColorRight, $bgRightStart } from "@core/stores/settings";

import styles from "./MainContainer.module.css";

type MainContainerProps = PropsWithChildren;

export function MainContainer({ children }: MainContainerProps) {
  const levels = useSubscribe($levelIds);
  const hues = useSubscribe($hueIds);
  const bgLeft = useSubscribe($bgColorLeft);
  const bgRight = useSubscribe($bgColorRight);
  const bgRightStart = useSubscribe($bgRightStart);
  const scrollbarSize = useScrollbarSize();

  return (
    <div
      className={styles.container}
      style={
        {
          "--bg-left": bgLeft,
          "--bg-right": bgRight,
          "--bg-right-started-at": bgRightStart,
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

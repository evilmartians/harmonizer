import { useSubscribe } from "@spred/react";
import type { CSSProperties, PropsWithChildren } from "react";

import styles from "./MainContainer.module.css";

import { $hueIds, $levelIds } from "@/stores/colors";
import { $bgColorDark, $bgColorLight, $bgLightStart } from "@/stores/settings";

type MainContainerProps = PropsWithChildren;

export function MainContainer({ children }: MainContainerProps) {
  const levels = useSubscribe($levelIds);
  const hues = useSubscribe($hueIds);
  const bgDark = useSubscribe($bgColorDark);
  const bgLight = useSubscribe($bgColorLight);
  const bgLightStart = useSubscribe($bgLightStart);

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
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

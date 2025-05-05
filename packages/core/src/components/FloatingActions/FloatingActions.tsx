import type { ReactNode } from "react";

import { useSubscribe } from "@spred/react";

import { BgMode } from "@core/components/BgMode/BgMode";
import { $bgColorLightBgMode } from "@core/stores/settings";

import styles from "./FloatingActions.module.css";

export type FloatingActionsProps = {
  children: ReactNode;
};

export function FloatingActions({ children }: FloatingActionsProps) {
  const bgMode = useSubscribe($bgColorLightBgMode);

  return (
    <BgMode bgMode={bgMode} className={styles.container}>
      {children}
    </BgMode>
  );
}

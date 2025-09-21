import type { ReactNode } from "react";

import { useSubscribe } from "@spred/react";

import { BgMode } from "@core/components/BgMode/BgMode";
import { $bgColorModeRight } from "@core/stores/settings";

import styles from "./FloatingActions.module.css";

export type FloatingActionsProps = {
  children: ReactNode;
};

export function FloatingActions({ children }: FloatingActionsProps) {
  const bgMode = useSubscribe($bgColorModeRight);

  return (
    <BgMode bgColorType={null} bgMode={bgMode} className={styles.container}>
      {children}
    </BgMode>
  );
}

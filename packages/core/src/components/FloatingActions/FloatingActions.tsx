import { useSubscribe } from "@spred/react";

import { BgMode } from "@core/components/BgMode/BgMode";
import { useDependencies } from "@core/DependenciesContext";
import { $bgColorLightBgMode } from "@core/stores/settings";

import styles from "./FloatingActions.module.css";

export function FloatingActions() {
  const { actions } = useDependencies();
  const bgMode = useSubscribe($bgColorLightBgMode);

  return (
    <BgMode bgMode={bgMode} className={styles.container}>
      {actions}
    </BgMode>
  );
}

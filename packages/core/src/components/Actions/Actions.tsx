import { BgMode } from "@core/components/BgMode/BgMode";
import { useDependencies } from "@core/DependenciesContext";
import { $bgColorLightBgMode } from "@core/stores/settings";
import { useSubscribe } from "@spred/react";

import styles from "./Actions.module.css";

export function Actions() {
  const { actions } = useDependencies();
  const bgMode = useSubscribe($bgColorLightBgMode);

  return (
    <BgMode bgMode={bgMode} className={styles.container}>
      {actions}
    </BgMode>
  );
}

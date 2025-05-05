import { BgMode } from "@core/components/BgMode/BgMode";
import { Button } from "@core/components/Button/Button";
import { MCross } from "@core/components/Icon/MCross";
import { Link } from "@core/components/Link/Link";
import { HARMONIZER_FIGMA_PLUGIN_URL } from "@core/constants";
import { persistedSignal } from "@core/utils/spred/persistedSignal";

import styles from "./FigmaPluginBanner.module.css";
import logoImage from "./logo.svg";

export const $isBannerClosed = persistedSignal("harmonizer:figma-plugin-banner-closed", false);

export function FigmaPluginBanner() {
  return (
    <BgMode bgMode="dark" className={styles.container}>
      <div className={styles.innerContainer}>
        <Link
          className={styles.link}
          size="m"
          kind="primary"
          href={HARMONIZER_FIGMA_PLUGIN_URL}
          target="_blank"
        >
          <img src={logoImage} alt="Harmonizer Logo" className={styles.logo} />
          Check out Harmonizer Figma Plugin
        </Link>
        <Button
          className={styles.closeButton}
          size="m"
          kind="ghost"
          icon={<MCross />}
          aria-label="Close banner"
          onClick={() => $isBannerClosed.set(true)}
        />
      </div>
    </BgMode>
  );
}

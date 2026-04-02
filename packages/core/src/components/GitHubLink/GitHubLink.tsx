import clsx from "clsx";

import { MGithub } from "@core/components/Icon/MGithub";

import buttonStyles from "../Button/Button.module.css";

const GITHUB_URL = "https://github.com/evilmartians/harmonizer";

export function GitHubLink() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className={clsx(buttonStyles.button, buttonStyles.kind_floating, buttonStyles.size_m)}
    >
      <MGithub className={buttonStyles.icon} />
    </a>
  );
}

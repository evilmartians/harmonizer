import { useSubscribe } from "@spred/react";
import clsx from "clsx";

import { ActionsRow } from "../TableRow/ActionsRow";
import { HeaderRow } from "../TableRow/HeaderRow";
import { HueRow } from "../TableRow/HueRow";

import styles from "./Table.module.css";

import { $hueIds } from "@/stores/colors";
import { resetHoveredColumn } from "@/stores/ui";

type TableProps = {
  className: string;
};

export function Table({ className }: TableProps) {
  const hueIds = useSubscribe($hueIds);

  return (
    <div className={clsx(className, styles.container)} onMouseLeave={resetHoveredColumn}>
      <HeaderRow />
      {hueIds.map((hueId) => (
        <HueRow key={hueId} hueId={hueId} />
      ))}
      <ActionsRow />
    </div>
  );
}

import type { SVGProps } from "react";

export type MArrowDownwardsProps = SVGProps<SVGSVGElement>;

export function MArrowDownwards(props: MArrowDownwardsProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6 8V4h4v4h2.699L8 13.034 3.301 8H6Zm1.269 5.717L2.57 8.682C1.974 8.043 2.427 7 3.301 7H5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3h1.699c.874 0 1.328 1.043.73 1.682l-4.698 5.035a1 1 0 0 1-1.462 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

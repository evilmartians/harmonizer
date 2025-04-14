import type { SVGProps } from "react";

export type MCheckProps = SVGProps<SVGSVGElement>;

export function MCheck(props: MCheckProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m11.926 4.762-4.332 7.04-3.448-3.448.708-.708L7.406 10.2l3.668-5.961.852.524Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

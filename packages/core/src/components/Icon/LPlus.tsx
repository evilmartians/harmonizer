import type { SVGProps } from "react";

export type LPlusProps = SVGProps<SVGSVGElement>;

export function LPlus(props: LPlusProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M11.4 6h1.2v5.4H18v1.2h-5.4V18h-1.2v-5.4H6v-1.2h5.4V6Z" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-1.2 0a8.8 8.8 0 1 1-17.6 0 8.8 8.8 0 0 1 17.6 0Z"
      />
    </svg>
  );
}

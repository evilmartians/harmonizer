import type { SVGProps } from "react";

export type MSixDotsProps = SVGProps<SVGSVGElement>;

export function MSixDots(props: MSixDotsProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        d="M7 3H5v2h2V3ZM11 3H9v2h2V3ZM5 7h2v2H5V7ZM7 11H5v2h2v-2ZM9 7h2v2H9V7ZM11 11H9v2h2v-2Z"
      />
    </svg>
  );
}

import type { SVGProps } from "react";

export type MPlusProps = SVGProps<SVGSVGElement>;

export function MPlus(props: MPlusProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        d="M8 2a6 6 0 1   0 0 12A6 6 0 0 0 8 2ZM1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm6.5-.5V4h1v3.5H12v1H8.5V12h-1V8.5H4v-1h3.5Z"
      />
    </svg>
  );
}

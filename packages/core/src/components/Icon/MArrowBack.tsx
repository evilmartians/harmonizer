import type { SVGProps } from "react";

export type MArrowBackProps = SVGProps<SVGSVGElement>;

export function MArrowBack(props: MArrowBackProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M6.07 3a2.5 2.5 0 0 0-2.08 1.113l-1.666 2.5a2.5 2.5 0 0 0 0 2.774l1.666 2.5A2.5 2.5 0 0 0 6.07 13h4.43a2.5 2.5 0 0 0 2.5-2.5v-5A2.5 2.5 0 0 0 10.5 3H6.07ZM4.822 4.668A1.5 1.5 0 0 1 6.07 4h4.43A1.5 1.5 0 0 1 12 5.5v5a1.5 1.5 0 0 1-1.5 1.5H6.07a1.5 1.5 0 0 1-1.248-.668l-1.666-2.5a1.5 1.5 0 0 1 0-1.664l1.666-2.5ZM8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}

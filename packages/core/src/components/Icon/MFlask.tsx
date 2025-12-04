import type { SVGProps } from "react";

export type MFlaskProps = SVGProps<SVGSVGElement>;

export function MFlask(props: MFlaskProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        d="M6.5 2h3v3.5l3 4.5c.5.75.5 1.5 0 2s-1.25.5-2 .5h-5c-.75 0-1.5 0-2-.5s-.5-1.25 0-2l3-4.5V2Zm1 0v4l-2.5 3.75c-.25.375-.25.75 0 1s.625.25 1 .25h4c.375 0 .75 0 1-.25s.25-.625 0-1L8.5 6V2h-1Z"
      />
    </svg>
  );
}

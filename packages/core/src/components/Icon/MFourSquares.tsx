import type { SVGProps } from "react";

export type MFourSquaresProps = SVGProps<SVGSVGElement>;

export function MFourSquares(props: MFourSquaresProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m11.026 2.423-.447 1.34a.5.5 0 0 1-.316.316l-1.34.447a.5.5 0 0 0 0 .948l1.34.447a.5.5 0 0 1 .316.316l.447 1.34a.5.5 0 0 0 .948 0l.447-1.34a.5.5 0 0 1 .316-.316l1.34-.447a.5.5 0 0 0 0-.948l-1.34-.447a.5.5 0 0 1-.316-.316l-.447-1.34a.5.5 0 0 0-.948 0Zm-1.295.808L9.823 3H5a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 5 13h7a1.5 1.5 0 0 0 1.5-1.5V6.677l-.23.092-.377.942a1.502 1.502 0 0 1-.393.567V9h-2v-.722a1.502 1.502 0 0 1-.393-.567l-.376-.942-.942-.376A1.502 1.502 0 0 1 8.222 6H7.5V4h.722c.146-.164.335-.3.567-.393l.942-.376ZM6.5 4v2h-2V4.5A.5.5 0 0 1 5 4h1.5Zm-2 5V7h2v2h-2Zm0 1v1.5a.5.5 0 0 0 .5.5h1.5v-2h-2Zm3 0v2h2v-2h-2Zm3 0v2H12a.5.5 0 0 0 .5-.5V10h-2Zm-1-1h-2V7h2v2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

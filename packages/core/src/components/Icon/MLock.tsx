import type { SVGProps } from "react";

export type MLockProps = SVGProps<SVGSVGElement>;

export function MLock(props: MLockProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        d="M5.5 7C4.94772 7 4.5 7.44772 4.5 8V11C4.5 11.5523 4.94772 12 5.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11V8C11.5 7.44772 11.0523 7 10.5 7H5.5ZM6.5 6V4.5C6.5 3.67157 7.17157 3 8 3C8.82843 3 9.5 3.67157 9.5 4.5V6H6.5ZM8 2C9.38071 2 10.5 3.11929 10.5 4.5V6C11.6046 6 12.5 6.89543 12.5 8V11C12.5 12.1046 11.6046 13 10.5 13H5.5C4.39543 13 3.5 12.1046 3.5 11V8C3.5 6.89543 4.39543 6 5.5 6V4.5C5.5 3.11929 6.61929 2 8 2Z"
        fill="currentColor"
      />
      <path
        d="M8 7.5C7.44772 7.5 7 7.94772 7 8.5C7 8.87014 7.2011 9.19331 7.5 9.36622V11H8.5V9.36622C8.7989 9.19331 9 8.87014 9 8.5C9 7.94772 8.55228 7.5 8 7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

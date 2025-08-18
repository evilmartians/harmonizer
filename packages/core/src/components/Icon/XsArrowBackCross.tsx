import type { SVGProps } from "react";

export type XsArrowBackProps = SVGProps<SVGSVGElement>;

export function XsArrowBackCross(props: XsArrowBackProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" {...props}>
      <path
        fill="currentColor"
        d="M8.875 4.125c0-.5523-.4478-1-1-1H4.5527a1 1 0 0 0-.832.4453l-1.25 1.875a1 1 0 0 0 0 1.1094l1.25 1.875a1 1 0 0 0 .832.4453H7.875c.5522 0 1-.4477 1-1v-3.75Zm-1.0186.7256L6.7265 6l1.13 1.1494-.713.7012-1.124-1.1436-1.169 1.1494-.7011-.7128 1.1699-1.1504-1.123-1.1426.7128-.7012 1.1172 1.1367 1.1172-1.1367.713.7012ZM9.875 7.875c0 1.1046-.8955 2-2 2H4.5527a2 2 0 0 1-1.664-.8906l-1.25-1.875a2 2 0 0 1 0-2.2188l1.25-1.875a2 2 0 0 1 1.664-.8906H7.875c1.1045 0 2 .8954 2 2v3.75Z"
      />
    </svg>
  );
}

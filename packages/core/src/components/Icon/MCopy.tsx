import type { SVGProps } from "react";

export type MCopyProps = SVGProps<SVGSVGElement>;

export function MCopy(props: MCopyProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        d="M10.354 5.646a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0Zm3.121-3.121a3.5 3.5 0 0 0-4.95 0L6.646 4.403a.5.5 0 1 0 .708.708l1.878-1.875a2.5 2.5 0 0 1 3.536 3.535l-1.88 1.878a.5.5 0 0 0 .708.708l1.879-1.882a3.5 3.5 0 0 0 0-4.95Zm-4.829 8.364-1.879 1.879a2.499 2.499 0 1 1-3.535-3.536l1.879-1.878a.5.5 0 1 0-.708-.708L2.525 8.525a3.5 3.5 0 1 0 4.95 4.95l1.879-1.88a.5.5 0 1 0-.708-.706Z"
      />
    </svg>
  );
}

import { App } from "@harmonizer/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

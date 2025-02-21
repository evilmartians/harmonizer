import type { ClientMessages, WorkerMessages } from "./types";

import { WorkerClient } from "@/utils/worker/WorkerClient";

export type { GenerateColorsPayload } from "@/utils/color";

export const generationWorker = new WorkerClient<ClientMessages, WorkerMessages>(
  new URL("worker.ts", import.meta.url),
  { type: "module" },
);

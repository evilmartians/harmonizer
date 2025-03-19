import type { ClientMessages, WorkerMessages } from "./types";
import Worker from "./worker.ts?worker";

import { WorkerClient } from "@/utils/worker/WorkerClient";

export type { GenerateColorsPayload } from "@/utils/colors/calculateColors";

export const generationWorker = new WorkerClient<ClientMessages, WorkerMessages>(new Worker());

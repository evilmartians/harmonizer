import { WorkerClient } from "@core/utils/worker/WorkerClient";

import type { ClientMessages, WorkerMessages } from "./types";
import Worker from "./worker.ts?worker";

export type { GenerateColorsPayload } from "@core/utils/colors/calculateColors";

export const generationWorker = new WorkerClient<ClientMessages, WorkerMessages>(new Worker());

import { WorkerTransport } from "@core/utils/communication-channel/transports/WorkerTransport";

import type { ClientMessages, WorkerMessages } from "./types";
import Worker from "./worker.ts?worker&inline";

export type { GenerateColorsPayload } from "@core/utils/colors/calculateColors";

const worker = new Worker();
export const workerChannel = WorkerTransport.createChannel<WorkerMessages, ClientMessages>(worker);

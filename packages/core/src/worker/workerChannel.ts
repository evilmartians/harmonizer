import { CommunicationChannel } from "@core/utils/communication-channel/CommunicationChannel";
import { WorkerTransport } from "@core/utils/communication-channel/transports/WorkerTransport";

import type { ClientMessages, WorkerMessages } from "./types";
import Worker from "./worker.ts?worker&inline";

export type { GenerateColorsPayload } from "@core/utils/colors/calculateColors";

const worker = new Worker();
const workerTransport = new WorkerTransport<WorkerMessages, ClientMessages>(worker);
export const workerChannel = new CommunicationChannel<WorkerMessages, ClientMessages>(
  workerTransport,
);

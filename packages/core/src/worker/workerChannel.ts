import { createPostMessageTransport, createTypedChannel } from "typed-channel";

import type { ClientMessages, WorkerMessages } from "./types";
import Worker from "./worker.ts?worker&inline";

export type { GenerateColorsPayload } from "@core/utils/colors/calculateColors";

const worker = new Worker();
const workerTransport = createPostMessageTransport<WorkerMessages, ClientMessages>(worker);
export const workerChannel = createTypedChannel(workerTransport);

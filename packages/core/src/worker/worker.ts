import { createPostMessageTransport, createTypedChannel } from "typed-channel";

import { calculateColors } from "@core/utils/colors/calculateColors";

import type { ClientMessages, WorkerMessages } from "./types";

const postMessageTransport = createPostMessageTransport<ClientMessages, WorkerMessages>(globalThis);
const clientChannel = createTypedChannel(postMessageTransport);

clientChannel.on("generate:colors", (payload) => {
  calculateColors(payload, (payload) => {
    clientChannel.emit(`generated:color`, payload);
  });
});

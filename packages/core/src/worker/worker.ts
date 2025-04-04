import { calculateColors } from "@core/utils/colors/calculateColors";
import { PostMessageTransport } from "@core/utils/communication-channel/transports/PostMessageTransport";

import type { ClientMessages, WorkerMessages } from "./types";

const clientChannel = PostMessageTransport.createChannel<ClientMessages, WorkerMessages>();

clientChannel.on("generate:colors", function (payload) {
  calculateColors(payload, (payload) => {
    this.emit(`generated:color`, payload);
  });
});

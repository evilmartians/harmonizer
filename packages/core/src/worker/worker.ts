import { calculateColors } from "@core/utils/colors/calculateColors";
import { CommunicationChannel } from "@core/utils/communication-channel/CommunicationChannel";
import { PostMessageTransport } from "@core/utils/communication-channel/transports/PostMessageTransport";

import type { ClientMessages, WorkerMessages } from "./types";

const postMessageTransport = new PostMessageTransport<ClientMessages, WorkerMessages>();
const clientChannel = new CommunicationChannel<ClientMessages, WorkerMessages>(
  postMessageTransport,
);

clientChannel.on("generate:colors", function (payload) {
  calculateColors(payload, (payload) => {
    this.emit(`generated:color`, payload);
  });
});

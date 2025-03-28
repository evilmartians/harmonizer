/* eslint-disable unicorn/prefer-add-event-listener */
import { CommunicationChannel } from "@core/utils/communication-channel/CommunicationChannel";
import type {
  AnyMessageOf,
  AnyMessages,
  CommunicationChannelTransport,
} from "@core/utils/communication-channel/types";
import type { PluginMessages, UIMessages } from "src/shared/types";

export class FigmaUiTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
> implements CommunicationChannelTransport<InboundMessages, OutboundMessages>
{
  onMessage(handler: (message: AnyMessageOf<InboundMessages>) => void) {
    const workerMessageHandler = (
      e: MessageEvent<{ pluginMessage: AnyMessageOf<InboundMessages> }>,
    ) => {
      handler(e.data.pluginMessage);
    };

    globalThis.onmessage = workerMessageHandler;

    return () => (globalThis.onmessage = null);
  }
  postMessage(message: AnyMessageOf<OutboundMessages>) {
    parent.postMessage({ pluginMessage: message }, "*");
  }
}

const transport = new FigmaUiTransport<PluginMessages, UIMessages>();
export const pluginChannel = new CommunicationChannel<PluginMessages, UIMessages>(transport);

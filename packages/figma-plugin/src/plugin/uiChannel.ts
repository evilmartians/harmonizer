/* eslint-disable unicorn/prefer-add-event-listener */
import { CommunicationChannel } from "@core/utils/communication-channel/CommunicationChannel";
import type {
  AnyMessageOf,
  AnyMessages,
  CommunicationChannelTransport,
} from "@core/utils/communication-channel/types";
import type { PluginMessages, UIMessages } from "@shared/types";

export class FigmaPluginTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
> implements CommunicationChannelTransport<InboundMessages, OutboundMessages>
{
  onMessage(handler: (message: AnyMessageOf<InboundMessages>) => void) {
    figma.ui.onmessage = handler;
    return () => (figma.ui.onmessage = undefined);
  }
  postMessage(message: AnyMessageOf<OutboundMessages>) {
    figma.ui.postMessage(message);
  }
}

const transport = new FigmaPluginTransport<UIMessages, PluginMessages>();
export const uiChannel = new CommunicationChannel<UIMessages, PluginMessages>(transport);

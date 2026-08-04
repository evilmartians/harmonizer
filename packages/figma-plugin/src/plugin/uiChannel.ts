/* oxlint-disable unicorn/prefer-add-event-listener */

import {
  createTypedChannel,
  type AnyMessages,
  type AnyMessageOf,
  type TypedChannelTransport,
} from "typed-channel";

import type { PluginMessages, UIMessages } from "@shared/types";

function createFigmaPluginTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages = InboundMessages,
>(): TypedChannelTransport<InboundMessages, OutboundMessages> {
  function on(handler: (message: AnyMessageOf<InboundMessages>) => void) {
    figma.ui.onmessage = handler;
    return () => (figma.ui.onmessage = undefined);
  }

  function emit(message: AnyMessageOf<OutboundMessages>) {
    figma.ui.postMessage(message);
  }

  return { on, emit };
}

const transport = createFigmaPluginTransport<UIMessages, PluginMessages>();
export const uiChannel = createTypedChannel(transport);

/* oxlint-disable unicorn/prefer-add-event-listener */

import {
  type AnyMessageOf,
  type AnyMessages,
  createTypedChannel,
  type TypedChannelTransport,
} from "typed-channel";

import type { PluginMessages, UIMessages } from "@shared/types";

function createFigmaUiTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
>(): TypedChannelTransport<InboundMessages, OutboundMessages> {
  function on(handler: (message: AnyMessageOf<InboundMessages>) => void) {
    const workerMessageHandler = (
      e: MessageEvent<{ pluginMessage: AnyMessageOf<InboundMessages> }>,
    ) => {
      handler(e.data.pluginMessage);
    };

    globalThis.onmessage = workerMessageHandler;

    return () => (globalThis.onmessage = null);
  }

  function emit(message: AnyMessageOf<OutboundMessages>) {
    // Figma drops a message with no pluginId when the UI is served from another origin, which is
    // always the case here. Without it the handshake never completes and the window stays blank.
    parent.postMessage({ pluginMessage: message, pluginId: __PLUGIN_ID__ }, "*");
  }

  return { on, emit };
}

const transport = createFigmaUiTransport<PluginMessages, UIMessages>();
export const pluginChannel = createTypedChannel(transport);

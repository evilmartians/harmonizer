/* eslint-disable unicorn/prefer-add-event-listener */
import type { PluginMessages, UIMessages } from "src/shared/types";
import {
  type AnyMessageOf,
  type AnyMessages,
  createTypedChannel,
  type TypedChannelTransport,
} from "typed-channel";

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
    parent.postMessage({ pluginMessage: message }, "*");
  }

  return { on, emit };
}

const transport = createFigmaUiTransport<PluginMessages, UIMessages>();
export const pluginChannel = createTypedChannel(transport);

import type { CleanupFunction, AnyMessages, CommunicationChannelTransport, Message } from "./types";

export class CommunicationChannel<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
> {
  private handlers = {} as {
    [K in keyof InboundMessages]?: ((payload: InboundMessages[K]) => void)[];
  };
  private unsubscribeIncomingMessages: CleanupFunction | undefined;

  constructor(private transport: CommunicationChannelTransport<InboundMessages, OutboundMessages>) {
    this.unsubscribeIncomingMessages = this.transport.onMessage(this.handleIncomingMessage);
  }

  destroy() {
    if (this.unsubscribeIncomingMessages) {
      this.unsubscribeIncomingMessages();
    }
  }

  emit<Type extends keyof OutboundMessages & string>(
    ...[type, payload]: OutboundMessages[Type] extends never
      ? [Type]
      : [Type, OutboundMessages[Type]]
  ) {
    this.transport.postMessage({ type, payload } as Message<Type, OutboundMessages[Type]>);
  }

  on<Type extends keyof InboundMessages>(
    type: Type,
    handler: (
      this: CommunicationChannel<InboundMessages, OutboundMessages>,
      payload: InboundMessages[Type],
    ) => void,
  ): CleanupFunction {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }

    this.handlers[type].push(handler);

    return () => {
      if (!this.handlers[type]) {
        return;
      }

      const index = this.handlers[type].indexOf(handler);
      if (index !== -1) {
        this.handlers[type].splice(index, 1);
      }
    };
  }

  private handleIncomingMessage = <Type extends keyof InboundMessages & string>(
    message: Message<Type, InboundMessages[Type]>,
  ) => {
    if (this.handlers[message.type]) {
      const handlers = this.handlers[message.type];

      if (!handlers) {
        return;
      }

      for (const handler of handlers) {
        handler.call(this, message.payload);
      }
    }
  };
}

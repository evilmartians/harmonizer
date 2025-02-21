type WorkerInputHandlers<
  InputMessages extends Record<string, unknown>,
  OutputMessages extends Record<string, unknown>,
> = {
  [K in keyof InputMessages]: (
    this: WorkerHandlers<InputMessages, OutputMessages>,
    payload: InputMessages[K],
  ) => void;
};

export class WorkerHandlers<
  IncomingMessages extends Record<string, unknown>,
  OutgoingMessages extends Record<string, unknown>,
> {
  private handlers = {} as WorkerInputHandlers<IncomingMessages, OutgoingMessages>;

  register(handlers: WorkerInputHandlers<IncomingMessages, OutgoingMessages>) {
    this.handlers = handlers;
    globalThis.addEventListener("message", this.handleMessage);

    return () => {
      globalThis.removeEventListener("message", this.handleMessage);
    };
  }

  emit<T extends keyof OutgoingMessages>(
    ...[type, payload]: OutgoingMessages[T] extends never ? [T] : [T, OutgoingMessages[T]]
  ) {
    globalThis.postMessage({ type, payload });
  }

  private handleMessage = <T extends keyof IncomingMessages>(
    e: MessageEvent<{
      type: T;
      payload: IncomingMessages[T];
    }>,
  ) => {
    this.handlers[e.data.type].call(this, e.data.payload);
  };
}

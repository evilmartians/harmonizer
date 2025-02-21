type AnyEventHandler = (...args: any[]) => void;

export class WorkerClient<
  OutgoingMessages extends Record<string, unknown>,
  IncomingMessages extends Record<string, unknown>,
> {
  private worker: Worker;
  private handlers = <Record<keyof IncomingMessages, AnyEventHandler[]>>{};

  constructor(scriptURL: string | URL, options?: WorkerOptions) {
    this.worker = new Worker(scriptURL, options);
  }

  emit<Type extends keyof OutgoingMessages>(type: Type, payload: OutgoingMessages[Type]): void {
    this.worker.postMessage({ type, payload });
  }

  on<Type extends keyof IncomingMessages>(
    type: Type,
    handler: (payload: IncomingMessages[Type]) => void,
    options?: { signal: AbortSignal },
  ): () => void {
    const lc = this.getListenersCount();
    const off = () => {
      const index = this.handlers[type].indexOf(handler);

      if (index !== -1) {
        this.handlers[type].splice(index, 1);
      }

      if (this.getListenersCount() === 0) {
        this.worker.removeEventListener("message", this.handleMessage);
      }
    };

    if (!(type in this.handlers)) {
      this.handlers[type] = [];
    }

    this.handlers[type].push(handler);

    if (lc === 0) {
      this.worker.addEventListener("message", this.handleMessage);
    }

    if (options?.signal) {
      options.signal.addEventListener("abort", () => {
        off();
      });
    }

    return off;
  }

  terminate(): void {
    for (const type of Object.keys(this.handlers)) {
      this.handlers[type as keyof IncomingMessages] = [];
    }
    this.worker.removeEventListener("message", this.handleMessage);
    this.worker.terminate();
  }

  private getListenersCount() {
    return Object.values(this.handlers).reduce((acc, handlers) => acc + handlers.length, 0);
  }

  private handleMessage = (e: MessageEvent) => {
    const message = e.data as { type: keyof IncomingMessages; payload: unknown[] };

    if (!(message.type in this.handlers)) {
      return;
    }

    for (const handler of this.handlers[message.type]) {
      handler(message.payload);
    }
  };
}

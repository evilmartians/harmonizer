import { CommunicationChannel } from "../CommunicationChannel";
import type { AnyMessageOf, AnyMessages, CommunicationChannelTransport } from "../types";

export class WorkerTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
> implements CommunicationChannelTransport<InboundMessages, OutboundMessages>
{
  constructor(private worker: Worker) {}

  static createChannel<InboundMessages extends AnyMessages, OutboundMessages extends AnyMessages>(
    worker: Worker,
  ): CommunicationChannel<InboundMessages, OutboundMessages> {
    const transport = new WorkerTransport<InboundMessages, OutboundMessages>(worker);

    return new CommunicationChannel<InboundMessages, OutboundMessages>(transport);
  }

  onMessage(handler: (message: AnyMessageOf<InboundMessages>) => void) {
    const workerMessageHandler = (e: MessageEvent<AnyMessageOf<InboundMessages>>) => {
      handler(e.data);
    };

    this.worker.addEventListener("message", workerMessageHandler);
    return () => this.worker.removeEventListener("message", workerMessageHandler);
  }
  postMessage(message: AnyMessageOf<OutboundMessages>) {
    this.worker.postMessage(message);
  }
}

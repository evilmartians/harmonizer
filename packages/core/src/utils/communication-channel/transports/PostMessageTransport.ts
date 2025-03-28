import type { AnyMessageOf, AnyMessages, CommunicationChannelTransport } from "../types";

type PostMessageInterface = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postMessage: (message: any) => void;
  addEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
  removeEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
};

export class PostMessageTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
> implements CommunicationChannelTransport<InboundMessages, OutboundMessages>
{
  constructor(private target: PostMessageInterface = globalThis) {}

  onMessage = (handler: (message: AnyMessageOf<InboundMessages>) => void) => {
    const handleMessage = (e: MessageEvent<AnyMessageOf<InboundMessages>>) => {
      handler(e.data);
    };

    this.target.addEventListener("message", handleMessage);

    return () => {
      this.target.removeEventListener("message", handleMessage);
    };
  };
  postMessage = (message: AnyMessageOf<OutboundMessages>) => {
    this.target.postMessage(message);
  };
}

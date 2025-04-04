import { CommunicationChannel } from "../CommunicationChannel";
import type { AnyMessageOf, AnyMessages, CommunicationChannelTransport } from "../types";

export class EventTargetTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
> implements CommunicationChannelTransport<InboundMessages, OutboundMessages>
{
  private eventTarget: EventTarget;

  static createChannel<
    InboundMessages extends AnyMessages,
    OutboundMessages extends AnyMessages,
  >(): CommunicationChannel<InboundMessages, OutboundMessages> {
    const transport = new EventTargetTransport<InboundMessages, OutboundMessages>();

    return new CommunicationChannel<InboundMessages, OutboundMessages>(transport);
  }

  constructor() {
    this.eventTarget = new EventTarget();
  }

  onMessage = (handler: (message: AnyMessageOf<InboundMessages>) => void) => {
    const handleMessage = (e: Event) => {
      handler((e as CustomEvent<AnyMessageOf<InboundMessages>>).detail);
    };

    this.eventTarget.addEventListener("message", handleMessage, { passive: true });

    return () => {
      this.eventTarget.removeEventListener("message", handleMessage);
    };
  };
  postMessage = (message: AnyMessageOf<OutboundMessages>) => {
    const event = new CustomEvent("message", { detail: message });
    this.eventTarget.dispatchEvent(event);
  };
}

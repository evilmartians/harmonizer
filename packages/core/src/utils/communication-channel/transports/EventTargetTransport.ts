import { CommunicationChannel } from "../CommunicationChannel";
import type { AnyMessageOf, AnyMessages, CommunicationChannelTransport } from "../types";

export class EventTargetTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages = InboundMessages,
> implements CommunicationChannelTransport<InboundMessages, OutboundMessages>
{
  private static EVENT_DEFAULT_OPTIONS = { passive: true };

  static createChannel<
    InboundMessages extends AnyMessages,
    OutboundMessages extends AnyMessages = InboundMessages,
  >(target?: EventTarget): CommunicationChannel<InboundMessages, OutboundMessages> {
    const transport = new EventTargetTransport<InboundMessages, OutboundMessages>(target);

    return new CommunicationChannel<InboundMessages, OutboundMessages>(transport);
  }

  constructor(private target = new EventTarget()) {}

  onMessage = (
    handler: (message: AnyMessageOf<InboundMessages>) => void,
    options: AddEventListenerOptions = EventTargetTransport.EVENT_DEFAULT_OPTIONS,
  ) => {
    const handleMessage = (e: Event) => {
      handler((e as CustomEvent<AnyMessageOf<InboundMessages>>).detail);
    };

    this.target.addEventListener("message", handleMessage, options);

    return (options?: EventListenerOptions) => {
      this.target.removeEventListener("message", handleMessage, options);
    };
  };

  postMessage = (message: AnyMessageOf<OutboundMessages>) => {
    const event = new CustomEvent("message", { detail: message });
    this.target.dispatchEvent(event);
  };
}

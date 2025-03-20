export type CleanupFunction = VoidFunction;

export type AnyMessages = Record<string, unknown>;

export type Message<Type extends string, Payload> = {
  type: Type;
  payload: Payload;
};

export type AnyMessageOf<T extends AnyMessages> = {
  [K in keyof T & string]: Message<K, T[K]>;
}[keyof T & string];

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface CommunicationChannelTransport<
  InboundMessages extends AnyMessages,
  OutboundMessages extends AnyMessages,
> {
  onMessage: (handler: (message: AnyMessageOf<InboundMessages>) => void) => CleanupFunction;
  postMessage: (message: AnyMessageOf<OutboundMessages>) => void;
}

import { vi } from "vitest";

const createMockChannel = () => {
  const listeners = new Map<string, Set<(payload: unknown) => void>>();

  const emit = vi.fn((event: string, payload: unknown) => {
    const handlers = listeners.get(event);
    if (!handlers) {
      return;
    }
    for (const handler of handlers) {
      handler(payload);
    }
  });

  const on = vi.fn((event: string, handler: (payload: unknown) => void) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)?.add(handler);
    return () => {
      listeners.get(event)?.delete(handler);
    };
  });

  return { emit, on };
};

vi.mock("typed-channel", () => ({
  createTypedChannel: () => createMockChannel(),
  createEventTargetTransport: () => ({}),
  createPostMessageTransport: () => ({}),
}));

vi.mock("@core/worker/workerChannel", () => ({
  workerChannel: {
    emit: vi.fn(),
    on: vi.fn(() => vi.fn()),
  },
}));

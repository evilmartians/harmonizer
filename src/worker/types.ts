import type { GenerateColorsPayload, GeneratedColorPayload } from "@/utils/colors/calculateColors";

// CLient to Worker messages
export type ClientMessages = {
  "generate:colors": GenerateColorsPayload;
};

// Worker to Client messages
export type WorkerMessages = {
  "generated:color": GeneratedColorPayload;
};

import type { ClientMessages, WorkerMessages } from "./types";

import { calculateColors } from "@/utils/color";
import { WorkerHandlers } from "@/utils/worker/WorkerHandlers";

const workerHandlers = new WorkerHandlers<ClientMessages, WorkerMessages>();

workerHandlers.register({
  "generate:colors": function (payload) {
    calculateColors(payload, (payload) => {
      this.emit(`generated:color`, payload);
    });
  },
});

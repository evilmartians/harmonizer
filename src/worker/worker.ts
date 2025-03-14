import type { ClientMessages, WorkerMessages } from "./types";

import { calculateColors } from "@/utils/colors/calculateColors";
import { WorkerHandlers } from "@/utils/worker/WorkerHandlers";

const workerHandlers = new WorkerHandlers<ClientMessages, WorkerMessages>();

workerHandlers.register({
  "generate:colors": function (payload) {
    calculateColors(payload, (payload) => {
      this.emit(`generated:color`, payload);
    });
  },
});

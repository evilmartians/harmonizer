import { calculateColors } from "@core/utils/colors/calculateColors";
import { WorkerHandlers } from "@core/utils/worker/WorkerHandlers";

import type { ClientMessages, WorkerMessages } from "./types";

const workerHandlers = new WorkerHandlers<ClientMessages, WorkerMessages>();

workerHandlers.register({
  "generate:colors": function (payload) {
    calculateColors(payload, (payload) => {
      this.emit(`generated:color`, payload);
    });
  },
});

import initialConfigJSON from "@core/config.json";
import { parse } from "@core/schemas";
import { exportConfigSchema } from "@core/schemas/exportConfigSchema";

export const initialConfig = parse(exportConfigSchema, initialConfigJSON);

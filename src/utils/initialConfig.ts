import initialConfigJSON from "@/config.json";
import { parse } from "@/schemas";
import { exportConfigSchema } from "@/schemas/exportConfigSchema";

export const initialConfig = parse(exportConfigSchema, initialConfigJSON);

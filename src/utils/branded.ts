import { type BaseIssue, type BaseSchema, parse } from "valibot";

export function getBranded<Input, Output>(schema: BaseSchema<Input, Output, BaseIssue<unknown>>) {
  return (value: Input): Output => parse(schema, value);
}

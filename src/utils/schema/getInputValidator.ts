import * as v from "valibot";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getInputNumberValidator(schema: v.BaseSchema<number, number, any>) {
  return v.pipe(
    v.string(),
    v.transform(Number.parseFloat),
    v.number("Value must be a number"),
    schema,
    v.transform(String),
  );
}

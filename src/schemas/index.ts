import { type BaseIssue, type BaseSchema, type GenericIssue, getDotPath, ValiError } from "valibot";

export { parse, safeParse } from "valibot";

export function isValidationError<TInput, TOutput, TIssue extends BaseIssue<unknown>>(
  error: unknown,
): error is ValiError<BaseSchema<TInput, TOutput, TIssue>> {
  return error instanceof ValiError;
}

export function formatValidationError(issues: GenericIssue[]): string {
  return issues
    .map((issue) => {
      const path = getDotPath(issue);

      return path ? `${issue.message}. Path: [${path}]` : issue.message;
    })
    .filter(Boolean)
    .join("\n");
}

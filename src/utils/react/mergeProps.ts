/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import clsx from "clsx";

import { chainCallbacks } from "./chainCallbacks";
import { mergeRefs } from "./mergeRefs";
import type { AnyProps } from "./types";

type PropsArg = AnyProps | null | undefined;
type NonNullablePropsArgs<T> = T extends (infer U)[] ? Exclude<U, null | undefined> : never;

type AllKeys<U> = U extends unknown ? keyof U : never;
type PropUnion<U, K extends PropertyKey> = U extends unknown
  ? K extends keyof U
    ? U[K]
    : never
  : never;
type ValueAtKey<T, K extends PropertyKey> = K extends keyof T ? T[K] : never;
type UnionMembersWithUndefined<U, K extends PropertyKey> = U extends unknown
  ? ValueAtKey<U, K> extends undefined
    ? U
    : never
  : never;

/**
 * A small helper to detect whether T is a "union of at least two distinct" members.
 * If T is one type or never, returns false; if T is a real union of 2+, returns true.
 */
type IsUnionOfAtLeast2<T, Full = T> =
  // If T is never, that means no member had `undefined` for this property.
  [T] extends [never]
    ? false
    : // Otherwise proceed with the old distribution logic
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends any
      ? [Exclude<Full, T>] extends [never]
        ? false
        : true
      : never;
/**
 * Our main type:
 *   1. For each key in the union of all keys,
 *   2. Gather the union of property-types.
 *   3. If none are non-undefined, the property is just undefined.
 *   4. If there’s at least one non-undefined type, union them all,
 *      and keep undefined only if at least two union members have undefined.
 */
type MergeUnion<U> = {
  [K in AllKeys<U>]: PropUnion<U, K> extends infer R // 1) Gather union of all property values for K
    ? // If R is only `undefined`, that means no one had a real type
      [Exclude<R, undefined>] extends [never]
      ? undefined
      : // There's at least one non-undefined type, so let's see if
        // we have multiple union members giving `undefined`
        IsUnionOfAtLeast2<UnionMembersWithUndefined<U, K>> extends true
        ? Exclude<R, undefined> | undefined
        : Exclude<R, undefined>
    : never;
};

type MergePropsResult<T extends PropsArg[]> = MergeUnion<NonNullablePropsArgs<T>>;

const EVENT_HANDLER_KEY_REGEX = /^on[A-Z]/;
const CLASS_NAME_KEY_REGEX = /[cC]lassName$/;

export function mergeProps<T extends PropsArg[]>(...allProps: T): MergePropsResult<T> {
  if (allProps.length === 1) {
    return allProps[0] as MergePropsResult<T>;
  }

  const resultProps: AnyProps = { ...allProps[0] };

  for (let i = 1; i < allProps.length; i++) {
    const props = allProps[i];
    for (const key in props) {
      const a = resultProps[key];
      const b = props[key];

      if (EVENT_HANDLER_KEY_REGEX.test(key)) {
        resultProps[key] = chainCallbacks(a, b);
      } else if (CLASS_NAME_KEY_REGEX.test(key)) {
        resultProps[key] = clsx(a, b);
      } else if (key === "ref") {
        resultProps[key] = mergeRefs(a, b);
      } else if (key === "style") {
        resultProps[key] = { ...a, ...b };
      } else {
        // override other keys
        resultProps[key] = b === undefined ? a : b;
      }
    }
  }

  return resultProps as MergePropsResult<T>;
}

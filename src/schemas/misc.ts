import * as v from "valibot";

export const getBrandedIdSchema = (brand: string) => v.pipe(v.string(), v.brand(brand));

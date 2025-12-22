import * as zod from "zod";

export function zodRequiredString(error: string) {
  return zod.string({ error }).min(1, { error });
}

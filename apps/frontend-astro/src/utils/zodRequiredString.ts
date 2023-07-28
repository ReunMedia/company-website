import * as zod from "zod";

export function zodRequiredString(message: string) {
  return zod.string({ required_error: message }).min(1, { message: message });
}

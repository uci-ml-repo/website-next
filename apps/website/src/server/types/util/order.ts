import { asc, desc } from "drizzle-orm";
import { z } from "zod";

export function order<const T extends string[]>(orderBy: T) {
  return z.partialRecord(z.enum<T>(orderBy), z.enum(["asc", "desc"]).optional());
}

export const sortMap = { asc, desc };

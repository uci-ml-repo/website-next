import { asc, desc } from "drizzle-orm";
import { z } from "zod";

export function order<const T extends [string, ...string[]]>(orderBy: T) {
  return z.record(z.enum(orderBy), z.enum(["asc", "desc"]).optional());
}

export function sortFunction(sort: "asc" | "desc" | undefined) {
  return sort === "desc" ? desc : asc;
}

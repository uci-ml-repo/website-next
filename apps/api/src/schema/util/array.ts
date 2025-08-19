import { z } from "@hono/zod-openapi";

export function stringArrayOf<T>(schema: z.ZodType<T>) {
  return z.string().transform((val) => val.split(",").map((part) => schema.parse(part)));
}

import { asc, desc, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { z } from "zod";

export function order<const T extends string[]>(orderBy: T) {
  return z.partialRecord(
    z.enum<T>(orderBy),
    z.enum(["asc", "desc", "ascNullsLast", "descNullsLast"]).optional(),
  );
}

export const sortMap = {
  asc,
  desc,
  ascNullsLast: (col: PgColumn) => sql`${col} ASC NULLS LAST`,
  descNullsLast: (col: PgColumn) => sql`${col} DESC NULLS LAST`,
} as const;

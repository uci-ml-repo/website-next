import type { SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";

export function sqlArray(array: string[], castTo: string = "text") {
  const items: SQL<unknown>[] = [];

  for (const item of array) {
    const chunk = sql`${item}`.queryChunks[1];
    if (chunk) {
      items.push(sql.raw(chunk.toString()));
    }
  }

  return sql.join([
    sql.raw(`'{`),
    sql.join(items, sql`,`),
    sql.raw(`}'`),
    sql.raw(`::${castTo}[]`),
  ]);
}

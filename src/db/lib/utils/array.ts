import { sql } from "drizzle-orm";

export function sqlArray(array: string[]) {
  return sql`${"{" + array.map((item) => `"${item}"`).join(",") + "}"}`;
}

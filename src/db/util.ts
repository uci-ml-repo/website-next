import type { AnyColumn } from "drizzle-orm";
import { sql } from "drizzle-orm";

export function enumToArray<T extends Record<string, string>>(enum_: T) {
  return Object.values(enum_) as [string, ...string[]];
}

export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column}
    +
    ${value}`;
};

export const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column}
    -
    ${value}`;
};

import type { PgColumn } from "drizzle-orm/pg-core";

export const selectColumns = <T extends Record<string, PgColumn>>(
  columns: T,
): { [K in keyof T]: true } => {
  return Object.keys(columns).reduce(
    (acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    },
    {} as { [K in keyof T]: true },
  );
};

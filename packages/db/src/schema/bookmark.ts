import { index, integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";

import { dataset } from "./dataset";
import { user } from "./user";

export const bookmark = pgTable(
  "bookmark",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => dataset.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.datasetId] }),
    index().on(t.userId),
    index().on(t.datasetId),
    index().on(t.createdAt),
  ],
);

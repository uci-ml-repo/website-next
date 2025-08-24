import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { dataset } from "./dataset";

export const author = pgTable(
  "author",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email"),
    institution: text("institution"),
    datasetId: integer("dataset_id").references(() => dataset.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [index().on(t.datasetId)],
);

export const authorRelations = relations(author, ({ one }) => ({
  dataset: one(dataset, {
    fields: [author.datasetId],
    references: [dataset.id],
  }),
}));

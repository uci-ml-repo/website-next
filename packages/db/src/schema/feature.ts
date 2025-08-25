import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { dataset } from "./dataset";
import { datasetFeatureRole, datasetFeatureType } from "./enum";

export const feature = pgTable(
  "feature",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    role: datasetFeatureRole("role").notNull(),
    type: datasetFeatureType("type").notNull(),
    missingValues: boolean("missing_values").notNull(),
    description: text("description"),
    units: text("units"),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => dataset.id, { onDelete: "cascade" }),
  },
  (t) => [unique().on(t.datasetId, t.name)],
);

export const featureRelations = relations(feature, ({ one }) => ({
  dataset: one(dataset, {
    fields: [feature.datasetId],
    references: [dataset.id],
  }),
}));

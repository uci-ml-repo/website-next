import { boolean, integer, pgEnum, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { Enums, enumToArray } from "../enum";
import { dataset } from "./dataset";

export const datasetFeatureRole = pgEnum(
  "dataset_feature_role",
  enumToArray(Enums.DatasetFeatureRole),
);

export const datasetFeatureType = pgEnum(
  "dataset_feature_type",
  enumToArray(Enums.DatasetFeatureType),
);

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

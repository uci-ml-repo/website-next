import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { Enums, enumToArray } from "../enum";
import { dataset } from "./dataset";

export const approvalStatus = pgEnum("approval_status", enumToArray(Enums.ApprovalStatus));

export const keyword = pgTable(
  "keyword",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    status: approvalStatus("status").notNull(),
    name: text("name").unique().notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("keyword_trgm_search_index").using("gin", sql`${t.name} gin_trgm_ops`),
    index("keyword_name_index").on(t.name),
    index("keyword_status_index").on(t.status),
  ],
);

export const keywordRelations = relations(keyword, ({ many }) => ({
  datasetKeywords: many(datasetKeyword),
}));

export const datasetKeyword = pgTable(
  "dataset_keyword",
  {
    keywordId: uuid("keyword_id")
      .notNull()
      .references(() => keyword.id, { onDelete: "cascade" }),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => dataset.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.keywordId, t.datasetId] })],
);

export const datasetKeywordRelations = relations(datasetKeyword, ({ one }) => ({
  keyword: one(keyword, {
    fields: [datasetKeyword.keywordId],
    references: [keyword.id],
  }),
  dataset: one(dataset, {
    fields: [datasetKeyword.datasetId],
    references: [dataset.id],
  }),
}));

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { Enums } from "../types/enum";
import { defaultUUID } from "../util/uuid";
import { author } from "./author";
import { bookmark } from "./bookmark";
import {
  approvalStatus,
  datasetDataType,
  datasetFeatureType,
  datasetSubjectArea,
  datasetTask,
} from "./enum";
import { feature } from "./feature";
import { keyword } from "./keyword";
import { user } from "./user";

export const dataset = pgTable(
  "dataset",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    yearCreated: integer("year_created"),
    doi: text("doi"),
    description: text("description").notNull(),
    citation: text("citation"),
    subjectArea: datasetSubjectArea("subject_area"),
    instanceCount: integer("instance_count"),
    featureCount: integer("feature_count"),
    hasGraphics: boolean("has_graphics").default(false).notNull(),
    isAvailablePython: boolean("is_available_python").default(false).notNull(),
    externalLink: text("external_link"),
    slug: text("slug").notNull().unique(),
    status: approvalStatus("status").default(Enums.ApprovalStatus.DRAFT).notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    downloadCount: integer("download_count"),
    dataTypes: datasetDataType("data_types").array().default([]).notNull(),
    tasks: datasetTask("tasks").array().default([]).notNull(),
    featureTypes: datasetFeatureType("feature_types").array().default([]).notNull(),
    size: bigint("size", { mode: "number" }),
    fileCount: integer("file_count"),
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "set default" })
      .default(defaultUUID)
      .notNull(),
    donatedAt: timestamp("donated_at", { mode: "date" }).defaultNow().notNull(),
    keywords: text("keywords").array().default([]).notNull(),
    features: text("features").array().default([]).notNull(),
  },
  (t) => [
    index().on(t.status),
    index().on(t.viewCount),
    index().on(t.donatedAt),
    index().on(t.instanceCount),
    index().on(t.featureCount),
    index("dataset_feature_count_nulls_last_index").on(t.featureCount.nullsLast()),
    index("dataset_keywords_index").using("gin", t.keywords),
    index("dataset_features_index").using("gin", t.features),
    index("dataset_trgm_search_index").using("gin", sql`${t.title} gin_trgm_ops`),
    check(
      "external_check",
      sql`
        (
          ${t.externalLink} IS NULL
          AND ${t.downloadCount} IS NOT NULL
        )
        OR (
          ${t.externalLink} IS NOT NULL
          AND ${t.externalLink} ~* '^https?://'
          AND ${t.downloadCount} IS NULL
        )
      `,
    ),
    check(
      "approved_check",
      sql`
        (
          ${t.status} = 'draft'
          OR (
            ${t.yearCreated} IS NOT NULL
            AND ${t.instanceCount} IS NOT NULL
            AND ${t.description} IS NOT NULL
            AND ${t.subjectArea} IS NOT NULL
          )
        )
        AND (
          ${t.status} != 'approved'
          OR ${t.doi} IS NOT NULL
        )
      `,
    ),
    check(
      "files_check",
      sql`
        ${t.status} = 'draft'
        OR (
          (
            ${t.externalLink} IS NULL
            AND ${t.size} IS NOT NULL
            AND ${t.fileCount} IS NOT NULL
          )
          OR (
            ${t.externalLink} IS NOT NULL
            AND ${t.size} IS NULL
            AND ${t.fileCount} IS NULL
          )
        )
      `,
    ),
    check(
      "files_exist_parity",
      sql`
        (
          ${t.fileCount} IS NULL
          AND ${t.size} IS NULL
        )
        OR (
          ${t.fileCount} IS NOT NULL
          AND ${t.size} IS NOT NULL
        )
      `,
    ),
  ],
);

export const datasetRelations = relations(dataset, ({ one, many }) => ({
  user: one(user, {
    fields: [dataset.userId],
    references: [user.id],
  }),
  features: many(feature),
  keywords: many(keyword),
  bookmarks: many(bookmark),
  authors: many(author),
}));

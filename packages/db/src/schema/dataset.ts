import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { Enums, enumToArray } from "../enum";
import { defaultUUID } from "../util/uuid";
import { user } from "./user";

export const approvalStatus = pgEnum("approval_status", enumToArray(Enums.ApprovalStatus));

export const datasetSubjectArea = pgEnum(
  "dataset_subject_area",
  enumToArray(Enums.DatasetSubjectArea),
);

export const datasetTask = pgEnum("dataset_task", enumToArray(Enums.DatasetTask));

export const datasetDataType = pgEnum("dataset_characteristic", enumToArray(Enums.DatasetDataType));

export const datasetFeatureType = pgEnum(
  "dataset_feature_type",
  enumToArray(Enums.DatasetFeatureType),
);

export const dataset = pgTable(
  "dataset",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    yearCreated: integer("year_created"),
    doi: text("doi"),
    description: text("description"),
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
    index("dataset_view_view_count_index").on(t.viewCount),
    index("dataset_view_donated_at_index").on(t.donatedAt),
    index("dataset_view_instance_count_index").on(t.instanceCount),
    index("dataset_view_feature_count_index").on(t.featureCount),
    index("dataset_view_status_index").on(t.status),
    index("dataset_view_keywords_index").using("gin", t.keywords),
    index("dataset_view_features_index").using("gin", t.features),
    index("dataset_view_trgm_search_index").using("gin", sql`${t.title} gin_trgm_ops`),
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

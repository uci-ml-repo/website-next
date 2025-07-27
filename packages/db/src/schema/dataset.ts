import {
  bigint,
  boolean,
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

export const dataset = pgTable("dataset", {
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
});

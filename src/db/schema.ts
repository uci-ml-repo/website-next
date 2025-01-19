import type { AdapterAccountType } from "@auth/core/adapters";
import { and, isNotNull, ne, or, relations } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { enumToArray } from "@/db/util";

import { Enums } from "./types";

export const userRole = pgEnum("user_role", enumToArray(Enums.UserRole));

export const datasetStatus = pgEnum(
  "dataset_status",
  enumToArray(Enums.DatasetStatus),
);

export const datasetSubjectArea = pgEnum(
  "dataset_subject_area",
  enumToArray(Enums.DatasetSubjectArea),
);

export const datasetTask = pgEnum(
  "dataset_task",
  enumToArray(Enums.DatasetTask),
);

export const datasetCharacteristic = pgEnum(
  "dataset_characteristic",
  enumToArray(Enums.DatasetCharacteristic),
);

export const datasetFeatureRole = pgEnum(
  "dataset_feature_role",
  enumToArray(Enums.DatasetFeatureRole),
);

export const datasetFeatureType = pgEnum(
  "dataset_feature_type",
  enumToArray(Enums.DatasetFeatureType),
);

export const datasetReportReason = pgEnum(
  "dataset_report_reason",
  enumToArray(Enums.DatasetReportReason),
);

export const discussionReportReason = pgEnum(
  "discussion_report_reason",
  enumToArray(Enums.DiscussionReportReason),
);

export const reportResolutionType = pgEnum(
  "dataset_report_resolution_type",
  enumToArray(Enums.ReportResolutionType),
);

export const datasets = pgTable(
  "datasets",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),

    yearCreated: integer("year_created"),
    subtitle: text("subtitle"),
    doi: text("doi"),
    description: text("description"),
    subjectArea: datasetSubjectArea("subject_area"),
    instanceCount: integer("instance_count"),
    featureCount: integer("feature_count"),
    hasGraphics: boolean("has_graphics").default(false).notNull(),
    isAvailablePython: boolean("is_available_python").default(false).notNull(),
    externalLink: text("external_link"),
    slug: text("slug").notNull(),
    status: datasetStatus("status").default("draft").notNull(),

    viewCount: integer("view_count").default(0).notNull(),
    downloadCount: integer("download_count").default(0).notNull(),

    variablesDescription: text("variables_description"),

    characteristics: datasetCharacteristic("characteristics").array(),
    tasks: datasetTask("tasks").array(),
    featureTypes: datasetFeatureType("feature_types").array(),

    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),

    donatedAt: date("donated_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    {
      checkConstraint: check(
        "accepted_check",
        or(
          ne(t.status, Enums.DatasetStatus.APPROVED),
          and(
            isNotNull(t.yearCreated),
            isNotNull(t.instanceCount),
            isNotNull(t.description),
            isNotNull(t.subjectArea),
          ),
        )!,
      ),
    },
  ],
);

export const datasetsRelations = relations(datasets, ({ one, many }) => ({
  user: one(users, {
    fields: [datasets.userId],
    references: [users.id],
  }),
  variables: many(variables),
  datasetKeywords: many(datasetKeywords),
  introductoryPaper: one(papers),
  bookmarks: many(bookmarks),
  authors: many(authors),
  reports: many(datasetReports),
}));

export const datasetReports = pgTable("dataset_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => datasets.id),
  reason: datasetReportReason("reason").notNull(),
  details: text("details").notNull(),
  userId: uuid("user_id"),
  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const datasetReportsRelations = relations(datasetReports, ({ one }) => ({
  dataset: one(datasets, {
    fields: [datasetReports.datasetId],
    references: [datasets.id],
  }),
  user: one(users, {
    fields: [datasetReports.userId],
    references: [users.id],
  }),
  resolution: one(datasetReportResolutions),
}));

export const datasetReportResolutions = pgTable("dataset_report_resolutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => datasetReports.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: reportResolutionType("type").notNull(),
  comment: text("comment").notNull(),
  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const datasetReportResolutionsRelations = relations(
  datasetReportResolutions,
  ({ one }) => ({
    report: one(datasetReports, {
      fields: [datasetReportResolutions.reportId],
      references: [datasetReports.id],
    }),
    user: one(users, {
      fields: [datasetReportResolutions.userId],
      references: [users.id],
    }),
  }),
);

export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),

  datasetId: integer("dataset_id").references(() => datasets.id),
});

export const variables = pgTable("variables", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  role: datasetFeatureRole("role").notNull(),
  type: datasetFeatureType("type").notNull(),
  missingValues: boolean("missing_values").notNull(),

  datasetId: integer("dataset_id")
    .notNull()
    .references(() => datasets.id),
});

export const variablesRelations = relations(variables, ({ one }) => ({
  dataset: one(datasets, {
    fields: [variables.datasetId],
    references: [datasets.id],
  }),
}));

export const keywords = pgTable("keywords", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: datasetStatus("status").notNull(),
  keyword: text("keyword").notNull(),

  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const keywordsRelations = relations(keywords, ({ many }) => ({
  datasetKeywords: many(datasetKeywords),
}));

export const datasetKeywords = pgTable(
  "dataset_keywords",
  {
    keywordId: uuid("keyword_id")
      .notNull()
      .references(() => keywords.id),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => datasets.id),
  },
  (t) => [primaryKey({ columns: [t.keywordId, t.datasetId] })],
);

export const datasetKeywordsRelations = relations(
  datasetKeywords,
  ({ one }) => ({
    keyword: one(keywords, {
      fields: [datasetKeywords.keywordId],
      references: [keywords.id],
    }),
    dataset: one(datasets, {
      fields: [datasetKeywords.datasetId],
      references: [datasets.id],
    }),
  }),
);

export const papers = pgTable("papers", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  authors: text("authors").array().notNull(),
  venue: text("venue").notNull(),
  year: integer("year").notNull(),

  semanticScholarId: integer("semantic_scholar_id").notNull(),

  introductoryForDatasetId: integer("introductory_for_dataset_id")
    .notNull()
    .references(() => datasets.id),
});

export const papersRelations = relations(papers, ({ one }) => ({
  introductoryForDataset: one(datasets, {
    fields: [papers.introductoryForDatasetId],
    references: [datasets.id],
  }),
}));

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => datasets.id),

    createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.datasetId] })],
);

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  dataset: one(datasets, {
    fields: [bookmarks.datasetId],
    references: [datasets.id],
  }),
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
}));

export const discussions = pgTable("discussions", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),

  replyToId: uuid("reply_to_id"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => datasets.id),

  upvoteCount: integer("upvote_count").default(0).notNull(),

  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  editedAt: date("edited_at", { mode: "date" }),
  deletedAt: date("deleted_at", { mode: "date" }),
  deletedByUserId: uuid("deleted_by_user_id"),
  deletionReason: discussionReportReason("deletion_reason"),
});

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  replyTo: one(discussions, {
    fields: [discussions.replyToId],
    references: [discussions.id],
  }),
  replies: many(discussions),
  upvotes: many(discussionUpvotes),
  user: one(users, {
    fields: [discussions.userId],
    references: [users.id],
  }),
}));

export const discussionUpvotes = pgTable(
  "discussion_upvotes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    discussionId: uuid("discussion_id")
      .notNull()
      .references(() => discussions.id),
    createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.discussionId] })],
);

export const discussionUpvotesRelations = relations(
  discussionUpvotes,
  ({ one }) => ({
    user: one(users, {
      fields: [discussionUpvotes.userId],
      references: [users.id],
    }),
    discussion: one(discussions, {
      fields: [discussionUpvotes.discussionId],
      references: [discussions.id],
    }),
  }),
);

export const discussionReports = pgTable("discussion_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  discussionId: uuid("discussion_id")
    .notNull()
    .references(() => discussions.id),
  reason: discussionReportReason("reason").notNull(),
  details: text("details"),
  userId: uuid("user_id"),
  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const discussionReportsRelations = relations(
  discussionReports,
  ({ one }) => ({
    discussion: one(discussions, {
      fields: [discussionReports.discussionId],
      references: [discussions.id],
    }),
    user: one(users),
    resolution: one(discussionReportResolutions),
  }),
);

export const discussionReportResolutions = pgTable(
  "discussion_report_resolutions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => discussionReports.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: reportResolutionType("type").notNull(),
    comment: text("comment").notNull(),
    createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  },
);

export const discussionReportResolutionsRelations = relations(
  discussionReportResolutions,
  ({ one }) => ({
    report: one(discussionReports, {
      fields: [discussionReportResolutions.reportId],
      references: [discussionReports.id],
    }),
    user: one(users, {
      fields: [discussionReportResolutions.userId],
      references: [users.id],
    }),
  }),
);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  role: userRole("role").default(Enums.UserRole.BASIC).notNull(),

  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  datasets: many(datasets),
  bookmarks: many(bookmarks),
}));

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

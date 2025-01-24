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

import { Enums } from "@/db/enums";
import { enumToArray } from "@/db/util";

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

export const dataset = pgTable(
  "dataset",
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
      .references(() => user.id)
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

export const datasetRelations = relations(dataset, ({ one, many }) => ({
  user: one(user, {
    fields: [dataset.userId],
    references: [user.id],
  }),
  variables: many(variable),
  datasetKeywords: many(datasetKeyword),
  bookmarks: many(bookmark),
  authors: many(author),
  reports: many(datasetReport),
  introductoryPaper: one(paper),
}));

export const datasetReport = pgTable("dataset_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => dataset.id),
  reason: datasetReportReason("reason").notNull(),
  details: text("details").notNull(),
  userId: uuid("user_id"),
  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const datasetReportRelations = relations(datasetReport, ({ one }) => ({
  dataset: one(dataset, {
    fields: [datasetReport.datasetId],
    references: [dataset.id],
  }),
  user: one(user, {
    fields: [datasetReport.userId],
    references: [user.id],
  }),
  resolution: one(datasetReportResolution),
}));

export const datasetReportResolution = pgTable("dataset_report_resolution", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => datasetReport.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  type: reportResolutionType("type").notNull(),
  comment: text("comment").notNull(),
  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const datasetReportResolutionRelations = relations(
  datasetReportResolution,
  ({ one }) => ({
    report: one(datasetReport, {
      fields: [datasetReportResolution.reportId],
      references: [datasetReport.id],
    }),
    user: one(user, {
      fields: [datasetReportResolution.userId],
      references: [user.id],
    }),
  }),
);

export const author = pgTable("author", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),

  datasetId: integer("dataset_id").references(() => dataset.id),
});

export const authorsRelations = relations(author, ({ one }) => ({
  dataset: one(dataset, {
    fields: [author.datasetId],
    references: [dataset.id],
  }),
}));

export const variable = pgTable("variable", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  role: datasetFeatureRole("role").notNull(),
  type: datasetFeatureType("type").notNull(),
  missingValues: boolean("missing_values").notNull(),
  units: text("units"),

  datasetId: integer("dataset_id")
    .notNull()
    .references(() => dataset.id),
});

export const variableRelations = relations(variable, ({ one }) => ({
  dataset: one(dataset, {
    fields: [variable.datasetId],
    references: [dataset.id],
  }),
}));

export const keyword = pgTable("keyword", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: datasetStatus("status").notNull(),
  keyword: text("keyword").notNull(),

  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const keywordsRelations = relations(keyword, ({ many }) => ({
  datasetKeywords: many(datasetKeyword),
}));

export const datasetKeyword = pgTable(
  "dataset_keyword",
  {
    keywordId: uuid("keyword_id")
      .notNull()
      .references(() => keyword.id),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => dataset.id),
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

export const paper = pgTable("paper", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  authors: text("authors").array().notNull(),
  venue: text("venue").notNull(),
  year: integer("year").notNull(),

  semanticScholarId: integer("semantic_scholar_id").notNull(),

  introductoryForDatasetId: integer("introductory_for_dataset_id")
    .notNull()
    .references(() => dataset.id),
});

export const paperRelations = relations(paper, ({ one }) => ({
  introductoryForDataset: one(dataset, {
    fields: [paper.introductoryForDatasetId],
    references: [dataset.id],
  }),
}));

export const bookmark = pgTable(
  "bookmark",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => dataset.id),

    createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.datasetId] })],
);

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  dataset: one(dataset, {
    fields: [bookmark.datasetId],
    references: [dataset.id],
  }),
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
}));

export const discussion = pgTable("discussion", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),

  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => dataset.id),

  upvoteCount: integer("upvote_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),

  archivedAt: date("deleted_at", { mode: "date" }),
  archivedByUserId: uuid("deleted_by_user_id"),
});

export const discussionRelations = relations(discussion, ({ one, many }) => ({
  upvotes: many(discussionUpvote),
  user: one(user, {
    fields: [discussion.userId],
    references: [user.id],
  }),
  comments: many(discussionComment),
  dataset: one(dataset, {
    fields: [discussion.datasetId],
    references: [dataset.id],
  }),
}));

export const discussionComment = pgTable("discussion_comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),

  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  discussionId: uuid("discussion_id")
    .notNull()
    .references(() => discussion.id),

  upvoteCount: integer("upvote_count").default(0).notNull(),

  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const discussionCommentRelations = relations(
  discussionComment,
  ({ one, many }) => ({
    upvotes: many(discussionCommentUpvote),
    user: one(user, {
      fields: [discussionComment.userId],
      references: [user.id],
    }),
    discussion: one(discussion, {
      fields: [discussionComment.discussionId],
      references: [discussion.id],
    }),
  }),
);

export const discussionUpvote = pgTable(
  "discussion_upvote",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    discussionId: uuid("discussion_id")
      .notNull()
      .references(() => discussion.id),
    createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.discussionId] })],
);

export const discussionUpvoteRelations = relations(
  discussionUpvote,
  ({ one }) => ({
    user: one(user, {
      fields: [discussionUpvote.userId],
      references: [user.id],
    }),
    discussion: one(discussion, {
      fields: [discussionUpvote.discussionId],
      references: [discussion.id],
    }),
  }),
);

export const discussionCommentUpvote = pgTable(
  "discussion_comment_upvote",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => discussionComment.id),
    createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.commentId] })],
);

export const discussionCommentUpvoteRelations = relations(
  discussionCommentUpvote,
  ({ one }) => ({
    user: one(user, {
      fields: [discussionCommentUpvote.userId],
      references: [user.id],
    }),
    comment: one(discussionComment, {
      fields: [discussionCommentUpvote.commentId],
      references: [discussionComment.id],
    }),
  }),
);

export const discussionReport = pgTable("discussion_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  discussionId: uuid("discussion_id")
    .notNull()
    .references(() => discussion.id),
  reason: discussionReportReason("reason").notNull(),
  details: text("details"),
  userId: uuid("user_id"),
  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const discussionReportRelations = relations(
  discussionReport,
  ({ one }) => ({
    discussion: one(discussion, {
      fields: [discussionReport.discussionId],
      references: [discussion.id],
    }),
    user: one(user, {
      fields: [discussionReport.userId],
      references: [user.id],
    }),
    resolution: one(discussionReportResolution),
  }),
);

export const discussionReportResolution = pgTable(
  "discussion_report_resolution",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => discussionReport.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    type: reportResolutionType("type").notNull(),
    comment: text("comment").notNull(),
    createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
  },
);

export const discussionReportResolutionRelations = relations(
  discussionReportResolution,
  ({ one }) => ({
    report: one(discussionReport, {
      fields: [discussionReportResolution.reportId],
      references: [discussionReport.id],
    }),
    user: one(user, {
      fields: [discussionReportResolution.userId],
      references: [user.id],
    }),
  }),
);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  role: userRole("role").default(Enums.UserRole.BASIC).notNull(),

  createdAt: date("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  datasets: many(dataset),
  bookmarks: many(bookmark),
  discussions: many(discussion),
  discussionReports: many(discussionReport),
  accounts: many(account),
  sessions: many(session),
}));

export const account = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
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

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const verificationToken = pgTable(
  "verificationToken",
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

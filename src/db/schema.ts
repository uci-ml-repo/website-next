import type { AdapterAccountType } from "@auth/core/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { Enums } from "@/db/lib/enums";
import type {
  AuthorSelect,
  DatasetSelect,
  PaperSelect,
  UserSelect,
  VariableSelect,
} from "@/db/lib/types";
import { baseUUID } from "@/db/lib/utils/uuid";
import { enumToArray } from "@/lib/utils";

/**
 * Enums
 */
export const userRole = pgEnum("user_role", enumToArray(Enums.UserRole));

export const approvalStatus = pgEnum(
  "approval_status",
  enumToArray(Enums.ApprovalStatus),
);

export const editStatus = pgEnum("edit_status", enumToArray(Enums.EditStatus));

export const datasetSubjectArea = pgEnum(
  "dataset_subject_area",
  enumToArray(Enums.DatasetSubjectArea),
);

export const datasetTask = pgEnum(
  "dataset_task",
  enumToArray(Enums.DatasetTask),
);

export const datasetDataType = pgEnum(
  "dataset_characteristic",
  enumToArray(Enums.DatasetDataType),
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

/**
 * Dataset tables
 */
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
    status: approvalStatus("status")
      .default(Enums.ApprovalStatus.DRAFT)
      .notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    downloadCount: integer("download_count"),
    dataTypes: datasetDataType("data_types").array(),
    tasks: datasetTask("tasks").array(),
    featureTypes: datasetFeatureType("feature_types").array(),
    size: bigint("size", { mode: "number" }),
    fileCount: integer("file_count"),
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "set default" })
      .default(baseUUID)
      .notNull(),
    donatedAt: timestamp("donated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
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
      "accepted_check",
      sql`
        ${t.status} = 'draft'
        OR (
          ${t.yearCreated} IS NOT NULL
          AND ${t.doi} IS NOT NULL
          AND ${t.instanceCount} IS NOT NULL
          AND ${t.description} IS NOT NULL
          AND ${t.subjectArea} IS NOT NULL
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

export const datasetView = pgTable(
  "dataset_view",
  {
    id: integer("id")
      .primaryKey()
      .references(() => dataset.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    yearCreated: integer("year_created"),
    doi: text("doi"),
    description: text("description"),
    subjectArea: datasetSubjectArea("subject_area"),
    instanceCount: integer("instance_count"),
    featureCount: integer("feature_count"),
    hasGraphics: boolean("has_graphics").notNull(),
    isAvailablePython: boolean("is_available_python").notNull(),
    externalLink: text("external_link"),
    slug: text("slug").notNull(),
    status: approvalStatus("status").notNull(),
    viewCount: integer("view_count").notNull(),
    downloadCount: integer("download_count"),
    dataTypes: datasetDataType("data_types").array(),
    tasks: datasetTask("tasks").array(),
    featureTypes: datasetFeatureType("feature_types").array(),
    size: bigint("size", { mode: "number" }),
    fileCount: integer("file_count"),
    userId: uuid("user_id").notNull(),
    donatedAt: timestamp("donated_at", { mode: "date" }).notNull(),
    keywords: text("keywords").array().notNull().$type<string[]>(),
    authors: jsonb("authors").array().notNull().$type<AuthorSelect[]>(),
    variables: jsonb("variables").array().notNull().$type<VariableSelect[]>(),
    variableNames: text("variable_names").array().notNull().$type<string>(),
    user: jsonb("user").notNull().$type<UserSelect>(),
    introductoryPaper: jsonb("introductory_paper").$type<PaperSelect>(),
  },
  (t) => [
    index("dataset_view_view_count_index").on(t.viewCount),
    index("dataset_view_donated_at_index").on(t.donatedAt),
    index("dataset_view_instance_count_index").on(t.instanceCount),
    index("dataset_view_feature_count_index").on(t.featureCount),
    index("dataset_view_keywords_index").using("gin", t.keywords),
    index("dataset_view_variable_names_index").using("gin", t.variableNames),
    index("dataset_view_status_index").on(t.status),
    index("dataset_view_trgm_search_index").using(
      "gin",
      sql`${t.title} gin_trgm_ops`,
    ),
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

export const edit = pgTable(
  "edit",
  {
    datasetId: integer("dataset_id")
      .references(() => dataset.id, {
        onDelete: "cascade",
      })
      .notNull(),
    version: integer("version").notNull(),
    newData: jsonb("new_data").$type<DatasetSelect>().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    submittedBy: uuid("submitted_by").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { mode: "date" }),
    reviewedBy: uuid("reviewed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    status: editStatus("status").default(Enums.EditStatus.PENDING).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.datasetId, t.version] }),
    check(
      "reviewed_check",
      sql`
        (
          ${t.reviewedAt} IS NULL
          AND ${t.reviewedBy} IS NULL
          AND ${t.status} = 'pending'
        )
        OR (
          ${t.reviewedAt} IS NOT NULL
          AND ${t.reviewedBy} IS NOT NULL
          AND ${t.status} != 'pending'
        )
      `,
    ),
  ],
);

export const editRelations = relations(edit, ({ one }) => ({
  dataset: one(dataset, {
    fields: [edit.datasetId],
    references: [dataset.id],
  }),
  reviewer: one(user, {
    fields: [edit.reviewedBy],
    references: [user.id],
  }),
}));

export const datasetReport = pgTable("dataset_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => dataset.id, { onDelete: "cascade" }),
  reason: datasetReportReason("reason").notNull(),
  details: text("details").notNull(),
  userId: uuid("user_id").references(() => user.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
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
}));

/**
 * Author tables
 */
export const author = pgTable("author", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  institution: text("institution"),
  datasetId: integer("dataset_id").references(() => dataset.id, {
    onDelete: "cascade",
  }),
});

export const authorsRelations = relations(author, ({ one }) => ({
  dataset: one(dataset, {
    fields: [author.datasetId],
    references: [dataset.id],
  }),
}));

/**
 * Variable tables
 */
export const variable = pgTable("variable", {
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
});

export const variableRelations = relations(variable, ({ one }) => ({
  dataset: one(dataset, {
    fields: [variable.datasetId],
    references: [dataset.id],
  }),
}));

/**
 * Keyword tables
 */
export const keyword = pgTable(
  "keyword",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    status: approvalStatus("status").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("keyword_trgm_search_index").using(
      "gin",
      sql`${t.name} gin_trgm_ops`,
    ),
    index("keyword_name_index").on(t.name),
    index("keyword_status_index").on(t.status),
  ],
);

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

/**
 * Paper tables
 */
export const paper = pgTable("paper", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  authors: text("authors").array().notNull(),
  venue: text("venue").notNull(),
  year: integer("year").notNull(),
  citationCount: integer("citation_count"),
  url: text("url").notNull(),
  datasetId: integer("dataset_id")
    .notNull()
    .references(() => dataset.id, { onDelete: "cascade" }),
});

export const paperRelations = relations(paper, ({ one }) => ({
  dataset: one(dataset, {
    fields: [paper.datasetId],
    references: [dataset.id],
  }),
}));

/**
 * Bookmark tables
 */
export const bookmark = pgTable(
  "bookmark",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => dataset.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.datasetId)],
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

/**
 * Discussion tables
 */
export const discussion = pgTable(
  "discussion",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    datasetId: integer("dataset_id")
      .notNull()
      .references(() => dataset.id, { onDelete: "cascade" }),
    upvoteCount: integer("upvote_count").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }),
  },
  (t) => [
    index("discussion_trgm_search_index").using(
      "gin",
      sql`${t.title} gin_trgm_ops`,
    ),
  ],
);

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
    .references(() => user.id, { onDelete: "cascade" }),
  discussionId: uuid("discussion_id")
    .notNull()
    .references(() => discussion.id, { onDelete: "cascade" }),
  upvoteCount: integer("upvote_count").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }),
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
      .references(() => user.id, { onDelete: "cascade" }),
    discussionId: uuid("discussion_id")
      .notNull()
      .references(() => discussion.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
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
      .references(() => user.id, { onDelete: "cascade" }),
    discussionCommentId: uuid("comment_id")
      .notNull()
      .references(() => discussionComment.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.discussionCommentId] })],
);

export const discussionCommentUpvoteRelations = relations(
  discussionCommentUpvote,
  ({ one }) => ({
    user: one(user, {
      fields: [discussionCommentUpvote.userId],
      references: [user.id],
    }),
    comment: one(discussionComment, {
      fields: [discussionCommentUpvote.discussionCommentId],
      references: [discussionComment.id],
    }),
  }),
);

export const discussionReport = pgTable("discussion_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  discussionId: uuid("discussion_id")
    .notNull()
    .references(() => discussion.id, { onDelete: "cascade" }),
  reason: discussionReportReason("reason").notNull(),
  details: text("details"),
  userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
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
  }),
);

export const discussionCommentReport = pgTable("discussion_comment_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  discussionCommentId: uuid("comment_id")
    .notNull()
    .references(() => discussion.id, { onDelete: "cascade" }),
  reason: discussionReportReason("reason").notNull(),
  details: text("details"),
  userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const commentReportRelations = relations(
  discussionCommentReport,
  ({ one }) => ({
    comment: one(discussionComment, {
      fields: [discussionCommentReport.discussionCommentId],
      references: [discussionComment.id],
    }),
    user: one(user, {
      fields: [discussionCommentReport.userId],
      references: [user.id],
    }),
  }),
);

/**
 * User tables
 */
export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    password: text("password"),
    image: text("image"),
    role: userRole("role").default(Enums.UserRole.BASIC).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("user_role_index").on(t.role),
    index("user_created_at_index").on(t.createdAt),
    index("user_email_trgm_search_index").using(
      "gin",
      sql`${t.email} gin_trgm_ops`,
    ),
    index("user_name_trgm_search_index").using(
      "gin",
      sql`${t.name} gin_trgm_ops`,
    ),
  ],
);

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
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const session = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const emailVerificationToken = pgTable("email_verification_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const emailVerificationTokenRelations = relations(
  emailVerificationToken,
  ({ one }) => ({
    user: one(user, {
      fields: [emailVerificationToken.userId],
      references: [user.id],
    }),
  }),
);

export const passwordResetToken = pgTable("password_reset_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  token: text("token").notNull(),
  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const passwordResetTokenRelations = relations(
  passwordResetToken,
  ({ one }) => ({
    user: one(user, {
      fields: [passwordResetToken.userId],
      references: [user.id],
    }),
  }),
);

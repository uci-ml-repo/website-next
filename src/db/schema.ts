import type { AdapterAccountType } from "@auth/core/adapters";
import { eq, getTableColumns, relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgMaterializedView,
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
    subtitle: text("subtitle"),
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
    downloadCount: integer("download_count").default(0).notNull(),

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
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
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
            AND ${t.externalLink} ~ * '^https?://'
            AND ${t.size} IS NULL
            AND ${t.fileCount} IS NULL
          )
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
  datasetId: integer("dataset_id").references(() => dataset.id),
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
    .references(() => dataset.id),
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

  // semanticScholarId: integer("semantic_scholar_id").notNull(),
  url: text("url").notNull(),

  datasetId: integer("dataset_id")
    .notNull()
    .references(() => dataset.id),
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
      .references(() => dataset.id),

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
  id: uuid("id").primaryKey().defaultRandom(),
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
  token: text("token").notNull().primaryKey(),
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

/**
 * Materialized views
 */
export const datasetView = pgMaterializedView("dataset_view").as((qb) => {
  return qb
    .select({
      ...getTableColumns(dataset),
      keywords: sql<string[]>`
        COALESCE(
          (
            SELECT
              ARRAY_AGG(${keyword.name})
            FROM
              ${keyword}
              JOIN ${datasetKeyword} ON ${datasetKeyword.keywordId} = ${keyword.id}
            WHERE
              ${datasetKeyword.datasetId} = ${dataset.id}
          ),
          ARRAY[]::TEXT[]
        )
      `.as("keywords"),
      authors: sql<AuthorSelect[]>`
        COALESCE(
          (
            SELECT
              ARRAY_AGG(
                JSONB_BUILD_OBJECT(
                  'id',
                  ${author.id},
                  'firstName',
                  ${author.firstName},
                  'lastName',
                  ${author.lastName},
                  'email',
                  ${author.email},
                  'institution',
                  ${author.institution}
                )
              )
            FROM
              ${author}
            WHERE
              ${author.datasetId} = ${dataset.id}
          ),
          ARRAY[]::JSONB[]
        )
      `.as("authors"),
      variables: sql<VariableSelect[]>`
        COALESCE(
          (
            SELECT
              ARRAY_AGG(
                JSONB_BUILD_OBJECT(
                  'id',
                  ${variable.id},
                  'name',
                  ${variable.name},
                  'description',
                  ${variable.description},
                  'role',
                  ${variable.role},
                  'type',
                  ${variable.type},
                  'missingValues',
                  ${variable.missingValues},
                  'units',
                  ${variable.units}
                )
              )
            FROM
              ${variable}
            WHERE
              ${variable.datasetId} = ${dataset.id}
          ),
          ARRAY[]::JSONB[]
        )
      `.as("variables"),
      variableNames: sql<string[]>`
        COALESCE(
          (
            SELECT
              ARRAY_AGG(LOWER(${variable.name}))
            FROM
              ${variable}
            WHERE
              ${variable.datasetId} = ${dataset.id}
          ),
          ARRAY[]::TEXT[]
        )
      `.as("variable_names"),
      user: sql<UserSelect>`
        (
          SELECT
            JSONB_BUILD_OBJECT(
              'id',
              ${user.id},
              'name',
              ${user.name},
              'email',
              ${user.email},
              'emailVerified',
              ${user.emailVerified},
              'image',
              ${user.image},
              'role',
              ${user.role},
              'createdAt',
              ${user.createdAt}
            )
          FROM
            ${user}
          WHERE
            ${user.id} = ${dataset.userId}
        )
      `.as("user"),
      introductoryPaper: sql<PaperSelect>`
        (
          SELECT
            JSONB_BUILD_OBJECT(
              'title',
              ${paper.title},
              'authors',
              ${paper.authors},
              'venue',
              ${paper.venue},
              'year',
              ${paper.year},
              'citationCount',
              ${paper.citationCount},
              'url',
              ${paper.url},
              'datasetId',
              ${paper.datasetId}
            )
          FROM
            ${paper}
          WHERE
            ${paper.datasetId} = ${dataset.id}
        )
      `.as("introductory_paper"),
    })
    .from(dataset)
    .leftJoin(paper, eq(dataset.id, paper.datasetId))
    .leftJoin(author, eq(dataset.id, author.datasetId))
    .leftJoin(variable, eq(dataset.id, variable.datasetId))
    .leftJoin(datasetKeyword, eq(dataset.id, datasetKeyword.datasetId))
    .groupBy(dataset.id);
});

import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { dataset } from "./dataset";

export const paper = pgTable("paper", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  authors: text("authors").array().notNull(),
  venue: text("venue").notNull(),
  year: integer("year").notNull(),
  citationCount: integer("citation_count"),
  url: text("url").notNull(),
});

export const paperRelations = relations(paper, ({ one }) => ({
  dataset: one(dataset),
}));

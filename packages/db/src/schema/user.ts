import { sql } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { Enums } from "../types/enum";
import { userRole } from "./enum";

export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: userRole("role").default(Enums.UserRole.BASIC).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index().on(t.createdAt, t.id),
    index().on(t.role),
    index("user_name_trgm_search_index").using("gin", sql`${t.name} gin_trgm_ops`),
    index("user_email_trgm_search_index").using("gin", sql`${t.email} gin_trgm_ops`),
  ],
);

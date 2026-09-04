import { user } from "@packages/db/schema";
import { and, ilike, inArray, or } from "drizzle-orm";

import type { UserQuery } from "@/server/types/user/request";

export function buildUserQuery(query: UserQuery) {
  const conditions = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(or(ilike(user.name, pattern), ilike(user.email, pattern)));
  }

  if (query.roles?.length) {
    conditions.push(inArray(user.role, query.roles));
  }

  return and(...conditions);
}

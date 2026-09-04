import { db } from "@packages/db";
import { Enums } from "@packages/db/enum";
import { user } from "@packages/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";

import { buildUserQuery } from "@/server/service/user/util";
import type { UserQuery } from "@/server/types/user/request";

const ROLE_ORDER = sql`
  CASE ${user.role}
    WHEN ${Enums.UserRole.ADMIN} THEN 0
    WHEN ${Enums.UserRole.LIBRARIAN} THEN 1
    WHEN ${Enums.UserRole.CURATOR} THEN 2
    WHEN ${Enums.UserRole.BASIC} THEN 3
    ELSE 4
  END
`;

async function byId(id: string) {
  const [result] = await db.select().from(user).where(eq(user.id, id));
  return result;
}

async function byEmail(email: string) {
  const [result] = await db.select().from(user).where(eq(user.email, email));
  return result;
}

function orderBy(query: UserQuery) {
  switch (query.order) {
    case "role":
      return [ROLE_ORDER, desc(user.createdAt), desc(user.id)];
    case "oldest":
      return [asc(user.createdAt), asc(user.id)];
    case "newest":
    default:
      return [desc(user.createdAt), desc(user.id)];
  }
}

async function byQuery(query: UserQuery) {
  const where = buildUserQuery(query);

  const users = await db.query.user.findMany({
    where,
    columns: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      createdAt: true,
    },
    with: {
      accounts: {
        columns: {
          id: true,
          userId: true,
          providerId: true,
        },
      },
    },
    orderBy: orderBy(query),
    offset: query.cursor ?? 0,
    limit: query.limit + 1,
  });

  let nextCursor: number | undefined = undefined;
  if (users.length > query.limit) {
    users.pop();
    nextCursor = (query.cursor ?? 0) + query.limit;
  }

  const count = await db.$count(user, where);

  return { users, count, nextCursor };
}

export const userFindService = { byId, byEmail, byQuery };

import { and, count, desc, eq, gt, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { userColumns, userSelect } from "@/db/lib/types";
import { accountSelect } from "@/db/lib/types/account";
import { account, user } from "@/db/schema";
import type { UserQuery, UserSearchQuery } from "@/server/schema/user";
import { ServiceError } from "@/server/service/errors";

function buildSearchQuery(search: string) {
  const nameTrigramSimilarity = sql`
    similarity (
      ${user.name},
      ${search}
    )
  `;
  const emailTrigramSimilarity = sql`
    similarity (
      ${user.email},
      ${search}
    )
  `;
  const trigramSimilarity = sql`
    (
      ${nameTrigramSimilarity} + ${emailTrigramSimilarity}
    ) / 2
  `;
  const searchCondition = sql`(${trigramSimilarity} > 0.1)`;

  return {
    nameTrigramSimilarity,
    emailTrigramSimilarity,
    trigramSimilarity,
    searchCondition,
  };
}

function buildQuery(query: UserQuery) {
  const conditions = [];

  if (query.search) {
    const { searchCondition } = buildSearchQuery(query.search);
    conditions.push(searchCondition);
  }

  if (query.role) {
    conditions.push(eq(user.role, query.role));
  }

  if (query.createdAfter) {
    conditions.push(gt(user.createdAt, query.createdAfter));
  }

  return and(...conditions);
}

export namespace userFindService {
  export async function byId(id: string) {
    return db.query.user.findFirst({
      where: eq(user.id, id),
      columns: userColumns,
    });
  }

  export async function batch(ids: string[]) {
    const users = await db.select(userSelect).from(user).where(inArray(user.id, ids));

    const userMap = new Map(users.map((u) => [u.id, u]));

    return ids.map((id) => {
      const u = userMap.get(id);
      if (!u) {
        throw new ServiceError({
          origin: "User",
          message: "User not found",
        });
      }
      return u;
    });
  }

  export async function accounts(userId: string) {
    return db.select(accountSelect).from(account).where(eq(account.userId, userId));
  }

  export async function byQuery(query: UserQuery) {
    let users;
    if (query.search) {
      users = await bySearchQuery(query as UserSearchQuery);
    } else {
      users = await byRawQuery(query);
    }

    let nextCursor: number | undefined = undefined;
    if (query.limit && users.length > query.limit) {
      users.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    const [countQuery] = await db.select({ count: count() }).from(user).where(buildQuery(query));

    return {
      users,
      count: countQuery.count,
      nextCursor,
    };
  }

  export async function countByQuery(query: UserQuery) {
    const [countQuery] = await db.select({ count: count() }).from(user).where(buildQuery(query));

    return countQuery.count;
  }

  async function byRawQuery(query: UserQuery) {
    return db
      .select(userSelect)
      .from(user)
      .where(buildQuery(query))
      .limit(query.limit ?? 10)
      .offset(query.cursor ?? 0)
      .orderBy(user.role);
  }

  async function bySearchQuery(query: UserSearchQuery) {
    const { trigramSimilarity } = buildSearchQuery(query.search);

    const users = await db
      .select({
        id: user.id,
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(user)
      .where(buildQuery(query))
      .limit(query.limit ?? 10)
      .offset(query.cursor ?? 0)
      .orderBy((t) => desc(t.similarity));

    return batch(users.map((d) => d.id));
  }
}

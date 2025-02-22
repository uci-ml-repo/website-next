import { and, count, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import { userColumns, userSelect } from "@/db/lib/types";
import { accountSelect } from "@/db/lib/types/account";
import { account, datasetView, user } from "@/db/schema";
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

  const searchCondition = sql`
    (
      ${nameTrigramSimilarity} > 0.05
      OR ${emailTrigramSimilarity} > 0.05
    )
  `;

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

  return and(...conditions);
}

export class UserFindService {
  async byId(id: string) {
    return db.query.user.findFirst({
      where: eq(user.id, id),
      columns: userColumns,
    });
  }

  async batch(ids: string[]) {
    const users = await db
      .select(userSelect)
      .from(user)
      .where(and(inArray(user.id, ids)));

    const userMap = new Map(users.map((user) => [user.id, user]));

    return ids.map((id) => {
      const user = userMap.get(id);
      if (!user) {
        throw new ServiceError({
          origin: "User",
          message: "User not found",
        });
      }
      return user;
    });
  }

  async accounts(userId: string) {
    return db
      .select(accountSelect)
      .from(account)
      .where(eq(account.userId, userId));
  }

  async byQuery(query: UserQuery) {
    let users;
    if (query.search) {
      users = await this.bySearchQuery(query as UserSearchQuery);
    } else {
      users = await this.byRawQuery(query);
    }

    let nextCursor: number | undefined = undefined;
    if (query.limit && users.length > query.limit) {
      users.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    const [countQuery] = await db
      .select({ count: count() })
      .from(user)
      .where(buildQuery(query));

    return {
      users,
      count: countQuery.count,
      nextCursor,
    };
  }

  async countByQuery(query: UserQuery) {
    const [countQuery] = await db
      .select({ count: count() })
      .from(user)
      .where(buildQuery(query));

    return countQuery.count;
  }

  private async byRawQuery(query: UserQuery) {
    return db
      .select(userSelect)
      .from(user)
      .where(buildQuery(query))
      .limit(query.limit ?? 10)
      .offset(query.cursor ?? 0)
      .orderBy(user.role);
  }

  private async bySearchQuery(query: UserSearchQuery) {
    const { trigramSimilarity } = buildSearchQuery(query.search);

    const users = await db
      .select({
        id: datasetView.id,
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(user)
      .where(buildQuery(query))
      .limit(query.limit ?? 10)
      .offset(query.cursor ?? 0)
      .orderBy((t) => desc(t.similarity));

    return this.batch(users.map((d) => d.id));
  }
}

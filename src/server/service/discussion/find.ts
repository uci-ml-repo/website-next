import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { dataset, discussion } from "@/db/schema";
import type { DiscussionQuery } from "@/server/service/schema/discussions";
import { sortFunction } from "@/server/service/schema/lib/order";

function buildQuery(query: DiscussionQuery) {
  let conditions = [];

  if (query.datasetId) {
    conditions.push(eq(discussion.datasetId, query.datasetId));
  }

  return and(...conditions);
}

export default class DiscussionFindService {
  async byId(id: string) {
    return db.query.discussion.findFirst({
      where: (discussion, { eq }) => eq(discussion.id, id),
      with: {
        user: true,
        dataset: true,
      },
    });
  }

  async byQuery(query: DiscussionQuery) {
    const orderBy = query.order
      ? query.order.map(({ orderBy, sort }) =>
          sortFunction(sort)(discussion[orderBy]),
        )
      : [asc(dataset.id)];

    const discussions = await db.query.discussion.findMany({
      where: buildQuery(query),
      orderBy: orderBy,
      with: {
        user: true,
        dataset: true,
      },
      limit: query.limit,
      offset: query.offset,
    });

    const [countQuery] = await db
      .select({ count: count() })
      .from(discussion)
      .where(buildQuery(query));

    return {
      discussions,
      count: countQuery.count,
    };
  }

  async byUserId(userId: string) {
    return db.query.discussion.findMany({
      where: (discussion, { eq }) => eq(discussion.userId, userId),
      with: {
        user: true,
        dataset: true,
      },
    });
  }
}

import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { dataset, discussion, discussionComment } from "@/db/schema";
import type { DiscussionCommentQuery } from "@/server/service/schema/discussions";
import { sortFunction } from "@/server/service/schema/lib/order";

function buildQuery(query: DiscussionCommentQuery) {
  let conditions = [];

  if (query.datasetId) {
    conditions.push(eq(discussion.datasetId, query.datasetId));
  }

  if (query.userId) {
    conditions.push(eq(discussion.userId, query.userId));
  }

  if (query.discussionId) {
    conditions.push(eq(discussion.id, query.discussionId));
  }

  return and(...conditions);
}

export default class DiscussionCommentFindService {
  async byId(id: string) {
    return db.query.discussionComment.findFirst({
      where: (discussionComment, { eq }) => eq(discussionComment.id, id),
      with: {
        user: true,
        discussion: true,
      },
    });
  }

  async byQuery(query: DiscussionCommentQuery) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(
            discussionComment[orderBy as keyof typeof query.order],
          ),
        )
      : [asc(dataset.id)];

    const discussionComments = await db.query.discussionComment.findMany({
      where: buildQuery(query),
      orderBy: orderBy,
      with: {
        user: true,
        discussion: true,
      },
      limit: query.limit,
      offset: query.offset,
    });

    const [countQuery] = await db
      .select({ count: count() })
      .from(discussionComment)
      .where(buildQuery(query));

    return {
      discussionComments,
      count: countQuery.count,
    };
  }
}

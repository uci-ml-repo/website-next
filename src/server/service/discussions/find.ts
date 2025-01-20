import { db } from "@/db";
import type { DiscussionQuery } from "@/server/schema/discussions";

export default class DiscussionsFindService {
  async byId(id: string) {
    return db.query.discussion.findFirst({
      where: (discussion, { eq }) => eq(discussion.id, id),
      with: {
        upvotes: true,
        user: true,
      },
    });
  }

  async byQuery(query: DiscussionQuery) {
    return [];
  }

  async byUserId(userId: string) {
    return db.query.discussion.findMany({
      where: (discussion, { eq }) => eq(discussion.userId, userId),
      with: {
        upvotes: true,
        user: true,
      },
    });
  }
}

import { db } from "@/db";
import type { DiscussionQuery } from "@/server/schema/discussions";

export default class DiscussionsFindService {
  async byId(id: string) {
    return db.query.discussions.findFirst({
      where: (discussions, { eq }) => eq(discussions.id, id),
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
    return db.query.discussions.findMany({
      where: (discussions, { eq }) => eq(discussions.userId, userId),
      with: {
        upvotes: true,
        user: true,
      },
    });
  }
}

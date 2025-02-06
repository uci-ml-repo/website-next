import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion } from "@/db/schema";
import ServiceError from "@/server/service/errors";

export default class DiscussionRemoveService {
  async byId({ discussionId }: { discussionId: string }) {
    const queriedDiscussion = await db.query.discussion.findFirst({
      where: (discussion, { eq }) => eq(discussion.id, discussionId),
      with: {
        comments: true,
      },
    });

    if (!queriedDiscussion) {
      throw new ServiceError({
        origin: "Discussion",
        message: "Discussion not found",
      });
    }

    return db.delete(discussion).where(eq(discussion.id, discussionId));
  }
}

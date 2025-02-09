import { db } from "@/db";
import { discussionComment } from "@/db/schema";

export class DiscussionCommentCreateService {
  async fromData({
    content,
    userId,
    discussionId,
  }: {
    content: string;
    userId: string;
    discussionId: string;
  }) {
    return db.insert(discussionComment).values({
      content,
      userId,
      discussionId,
    });
  }
}

import { db } from "@/db";
import { comment } from "@/db/schema";

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
    return db.insert(comment).values({
      content,
      userId,
      discussionId,
    });
  }
}

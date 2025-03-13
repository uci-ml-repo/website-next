import { db } from "@/db";
import { discussionComment } from "@/db/schema";

export namespace discussionCommentCreateService {
  export async function fromData({
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

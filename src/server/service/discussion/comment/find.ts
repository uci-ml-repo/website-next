import { db } from "@/db";

export default class DiscussionCommentFindService {
  async byId(id: string) {
    return db.query.discussionComment.findFirst({
      where: (discussionComment, { eq }) => eq(discussionComment.id, id),
    });
  }
}

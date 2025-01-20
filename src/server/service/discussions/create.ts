import { db } from "@/db";
import { discussion } from "@/db/schema";

export default class DiscussionsCreateService {
  async fromData({
    content,
    userId,
    datasetId,
    replyToId,
  }: {
    content: string;
    userId: string;
    datasetId: number;
    replyToId?: string;
  }) {
    return db.insert(discussion).values({
      content,
      userId,
      datasetId,
      replyToId,
    });
  }
}

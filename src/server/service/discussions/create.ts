import { db } from "@/db";
import { discussions } from "@/db/schema";

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
    return db.insert(discussions).values({
      content,
      userId,
      datasetId,
      replyToId,
    });
  }
}

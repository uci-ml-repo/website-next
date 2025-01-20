import { db } from "@/db";
import { discussion } from "@/db/schema";

export default class DiscussionsCreateService {
  async fromData({
    title,
    content,
    userId,
    datasetId,
  }: {
    title: string;
    content: string;
    userId: string;
    datasetId: number;
  }) {
    return db.insert(discussion).values({
      title,
      content,
      userId,
      datasetId,
    });
  }
}

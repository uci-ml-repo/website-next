import { db } from "@/db";
import { discussion } from "@/db/schema";

export namespace discussionCreateService {
  export async function fromData({
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
    const [inserted] = await db
      .insert(discussion)
      .values({
        title,
        content,
        userId,
        datasetId,
      })
      .returning();

    return inserted;
  }
}

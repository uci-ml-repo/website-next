import { db } from "@/db";
import { bookmark } from "@/db/schema";

export class BookmarkCreateService {
  async addBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    return db.insert(bookmark).values({
      datasetId,
      userId,
    });
  }
}

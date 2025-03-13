import { db } from "@/db";
import { bookmark } from "@/db/schema";

export namespace bookmarkCreateService {
  export async function addBookmark({
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

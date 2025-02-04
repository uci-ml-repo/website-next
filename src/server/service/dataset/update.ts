import { eq } from "drizzle-orm";
import path from "path";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import { datasetFilesPath } from "@/lib/utils";
import service from "@/server/service";

export default class DatasetUpdateService {
  async zipSize(input: { id: number; slug: string; status: string }) {
    if (!process.env.STATIC_FILES_DIRECTORY) {
      throw new Error("STATIC_FILES_DIRECTORY is not set");
    }

    const zipSize = await service.file.read.zipStats({
      absolutePath: path.join(
        process.env.STATIC_FILES_DIRECTORY,
        datasetFilesPath(input) + ".zip",
      ),
    });

    return db.update(dataset).set(zipSize).where(eq(dataset.id, input.id));
  }
}

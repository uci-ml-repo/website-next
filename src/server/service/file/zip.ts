import { eq } from "drizzle-orm";
import fs from "fs-extra";
import path from "path";
import yauzl from "yauzl";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import { service } from "@/server/service";

export namespace fileZipService {
  export async function unzip({
    absolutePath,
    datasetId,
    overwrite,
    updateZipStats,
    unzipPath = absolutePath.replace(/\.zip$/, ""),
    limitSize = 5 * 1024 * 1024 * 1024, // 5 GB
  }: {
    absolutePath: string;
    datasetId: number;
    overwrite?: boolean;
    updateZipStats?: boolean;
    unzipPath?: string;
    limitSize?: number;
  }) {
    let totalSize = 0;
    let cancelled = false;

    const zipStats = await service.file.read.zipStats({ absolutePath });

    const [datasetToUnzip] = updateZipStats
      ? await db
          .update(dataset)
          .set({
            size: zipStats.size,
            fileCount: zipStats.fileCount,
          })
          .where(eq(dataset.id, datasetId))
          .returning()
      : await db.select().from(dataset).where(eq(dataset.id, datasetId));

    if (zipStats.uncompressedSize > limitSize) {
      return {
        success: false,
        message: `Exceeded limit of ${limitSize} bytes`,
        dataset: datasetToUnzip,
      };
    }

    try {
      if (overwrite) {
        await fs.remove(unzipPath);
      }

      await fs.ensureDir(unzipPath);

      await new Promise<void>((resolve, reject) => {
        yauzl.open(absolutePath, { lazyEntries: true }, (err, zipfile) => {
          if (err) return reject(err);
          if (!zipfile) return reject(new Error("Could not open zip file"));

          zipfile.readEntry();

          zipfile.on("entry", (entry) => {
            if (entry.fileName.endsWith("/")) {
              fs.ensureDir(path.join(unzipPath, entry.fileName))
                .then(() => zipfile.readEntry())
                .catch((err) => {
                  zipfile.close();
                  reject(err);
                });
            } else {
              const fullPath = path.join(unzipPath, entry.fileName);
              fs.ensureDir(path.dirname(fullPath))
                .then(() => {
                  zipfile.openReadStream(entry, (err, readStream) => {
                    if (err || !readStream) {
                      zipfile.close();
                      return reject(err || new Error("Could not open read stream"));
                    }
                    const writeStream = fs.createWriteStream(fullPath);

                    readStream.on("data", (chunk: Buffer) => {
                      totalSize += chunk.length;
                      if (totalSize > limitSize && !cancelled) {
                        cancelled = true;
                        readStream.destroy(new Error(`Exceeded limit of ${limitSize} bytes`));
                      }
                    });

                    readStream.pipe(writeStream);

                    writeStream.on("finish", () => {
                      if (!cancelled) {
                        zipfile.readEntry();
                      }
                    });

                    writeStream.on("error", (err) => {
                      zipfile.close();
                      reject(err);
                    });
                    readStream.on("error", (err) => {
                      zipfile.close();
                      reject(err);
                    });
                  });
                })
                .catch((err) => {
                  zipfile.close();
                  reject(err);
                });
            }
          });

          zipfile.on("end", () => {
            if (cancelled) {
              reject(new Error(`Exceeded limit of ${limitSize} bytes`));
            } else {
              resolve();
            }
          });

          zipfile.on("error", (err) => {
            zipfile.close();
            reject(err);
          });
        });
      });
    } catch (error) {
      await fs.remove(unzipPath);
      return {
        success: false,
        message: (error as Error).message,
        dataset: datasetToUnzip,
      };
    }

    return {
      success: true,
      message: unzipPath,
      dataset: datasetToUnzip,
    };
  }
}

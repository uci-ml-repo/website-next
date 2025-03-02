import fs from "fs-extra";
import path from "path";
import yauzl from "yauzl";

import { service } from "@/server/service";

export class FileZipService {
  async unzip({
    absolutePath,
    unzipPath = absolutePath.replace(/\.zip$/, ""),
    limitSize = 5 * 1024 * 1024 * 1024, // 5 GB
  }: {
    absolutePath: string;
    unzipPath?: string;
    limitSize?: number;
  }) {
    let totalSize = 0;
    let cancelled = false;

    const zipStats = await service.file.read.zipStats({ absolutePath });

    if (!zipStats?.uncompressedSize || zipStats.uncompressedSize > limitSize) {
      return {
        success: false,
        message: `Exceeded limit of ${limitSize} bytes`,
      };
    }

    try {
      await fs.ensureDir(unzipPath);

      await new Promise<void>((resolve, reject) => {
        yauzl.open(absolutePath, { lazyEntries: true }, (err, zipfile) => {
          if (err) return reject(err);

          if (!zipfile) {
            return reject(new Error("Could not open zip file"));
          }

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
                    if (err) {
                      zipfile.close();
                      return reject(err);
                    }
                    if (!readStream) {
                      zipfile.close();
                      return reject(new Error("Could not open read stream"));
                    }
                    const writeStream = fs.createWriteStream(fullPath);

                    readStream.on("data", (chunk: Buffer) => {
                      totalSize += chunk.length;
                      if (totalSize > limitSize && !cancelled) {
                        cancelled = true;
                        readStream.destroy(
                          new Error(`Exceeded limit of ${limitSize} bytes`),
                        );
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
      // Clean up unzipped files
      await fs.remove(unzipPath);

      return {
        success: false,
        message: (error as Error).message,
      };
    }

    return {
      success: true,
      message: unzipPath,
    };
  }
}

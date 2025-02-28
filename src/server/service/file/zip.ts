import StreamZip from "node-stream-zip";
import path from "path";

import { service } from "@/server/service";
import { ServiceError } from "@/server/service/errors";

export class FileZipService {
  async unzip({ absolutePath }: { absolutePath: string }) {
    const zipStats = await service.file.read.zipStats({
      absolutePath,
    });

    if (!zipStats.size) {
      throw new ServiceError({
        origin: "File",
        message: "File missing",
      });
    } else if (zipStats.size > 100_000_000) {
      throw new ServiceError({
        origin: "File",
        message: "File too large to unzip",
      });
    }

    const unzipPath = path.join(
      path.dirname(absolutePath),
      path.basename(absolutePath),
    );

    const zip = new StreamZip.async({ file: absolutePath });
    await zip.extract(null, unzipPath);
    await zip.close();
  }
}

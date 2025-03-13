import crypto from "crypto";
import fs from "fs-extra";
import StreamZip from "node-stream-zip";
import readline from "readline";

import { ServiceError } from "@/server/service/errors";

export namespace fileReadService {
  export async function readZippedFile({
    absoluteZipPath,
    relativeFilePath,
    cursor = 0,
    takeLines = 50,
  }: {
    absoluteZipPath: string;
    relativeFilePath: string;
    cursor?: number;
    takeLines?: number;
  }) {
    const zip = new StreamZip.async({ file: absoluteZipPath });
    try {
      const entries = await zip.entries();
      if (!entries[relativeFilePath]) {
        throw new ServiceError({
          origin: "File",
          message: `File ${relativeFilePath} not found in zip ${absoluteZipPath}`,
        });
      }

      const fileStream = await zip.stream(relativeFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let index = 0;
      const lines: string[] = [];
      for await (const line of rl) {
        if (index >= cursor && lines.length < takeLines) {
          lines.push(line);
        } else if (lines.length >= takeLines) {
          break;
        }
        index++;
      }

      await zip.close();

      const hasMoreLines = lines.length === takeLines;
      return { lines, cursor: hasMoreLines ? cursor + takeLines : undefined };
    } finally {
      await zip.close();
    }
  }

  export async function readFile({
    absolutePath,
    cursor = 0,
    takeLines = 50,
  }: {
    absolutePath: string;
    cursor?: number;
    takeLines?: number;
  }) {
    const fileStream = fs.createReadStream(absolutePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let index = 0;
    const lines: string[] = [];

    for await (const line of rl) {
      if (index >= cursor && lines.length < takeLines) {
        lines.push(line);
      } else if (lines.length >= takeLines) {
        break;
      }
      index++;
    }

    rl.close();
    fileStream.close();

    const hasMoreLines = lines.length === takeLines;

    return { lines, cursor: hasMoreLines ? cursor + takeLines : undefined };
  }

  export async function stats({ absolutePath }: { absolutePath: string }) {
    if (!fs.pathExistsSync(absolutePath)) {
      throw new ServiceError({
        origin: "File",
        message: `Invalid file path: ${absolutePath}`,
      });
    }
    return fs.stat(absolutePath);
  }

  export async function zipStats({ absolutePath }: { absolutePath: string }) {
    const zip = new StreamZip.async({ file: absolutePath });

    const entries = Object.entries(await zip.entries());

    let uncompressedSize = 0;
    let fileCount = 0;
    for (const [_path, entry] of entries) {
      if (!entry.isDirectory) {
        fileCount++;
        uncompressedSize += entry.size;
      }
    }

    await zip.close();

    return {
      fileCount,
      size: fs.statSync(absolutePath).size,
      uncompressedSize,
    };
  }

  export async function checksum({
    absolutePath,
    algorithm = "sha512",
  }: {
    absolutePath: string;
    algorithm?: string;
  }) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(algorithm);
      const stream = fs.createReadStream(absolutePath);

      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("end", () => resolve(hash.digest("hex")));
      stream.on("error", (err) => reject(err));
    });
  }
}

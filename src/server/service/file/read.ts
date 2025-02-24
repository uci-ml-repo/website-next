import fs from "fs-extra";
import StreamZip from "node-stream-zip";
import readline from "readline";

import { ServiceError } from "@/server/service/errors";

interface ReadFileParams {
  absolutePath: string;
  cursor?: number;
  takeLines?: number;
}

export class FileReadService {
  async readFileInfinite({
    absolutePath,
    cursor = 0,
    takeLines = 50,
  }: ReadFileParams) {
    if (!fs.pathExistsSync(absolutePath)) {
      throw new ServiceError({
        origin: "File",
        message: `Invalid file path: ${absolutePath}`,
      });
    }

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

    return {
      lines,
      cursor: hasMoreLines ? cursor + takeLines : undefined,
    };
  }

  async stats({ absolutePath }: { absolutePath: string }) {
    if (!fs.pathExistsSync(absolutePath)) {
      throw new ServiceError({
        origin: "File",
        message: `Invalid file path: ${absolutePath}`,
      });
    }

    return fs.stat(absolutePath);
  }

  async zipStats({ absolutePath }: { absolutePath: string }) {
    if (!fs.pathExistsSync(absolutePath)) {
      return {
        size: null,
        fileCount: null,
      };
    }

    const zip = new StreamZip.async({ file: absolutePath });

    const entries = Object.entries(await zip.entries());

    let uncompressedSize = 0;
    let fileCount = 0;

    for (const [_path, entry] of entries) {
      if (!entry.isDirectory) {
        uncompressedSize += entry.size;
        fileCount++;
      }
    }

    await zip.close();

    return {
      fileCount,
      uncompressedSize,
      compressedSize: fs.statSync(absolutePath).size,
    };
  }
}

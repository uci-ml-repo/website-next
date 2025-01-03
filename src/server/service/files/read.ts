import type { PrismaClient } from "@prisma/client";
import AdmZip from "adm-zip";
import fs from "fs-extra";
import readline from "readline";

import ServiceError from "@/server/service/errors";

interface ReadFileParams {
  absolutePath: string;
  cursor?: number;
  takeLines?: number;
}

export default class FilesReadService {
  constructor(readonly prisma: PrismaClient) {}

  async readFileInfinite({
    absolutePath,
    cursor = 0,
    takeLines = 50,
  }: ReadFileParams) {
    if (!fs.pathExistsSync(absolutePath)) {
      throw new ServiceError({ reason: "Invalid File Path", origin: "File" });
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
      throw new ServiceError({ reason: "Invalid File Path", origin: "File" });
    }

    return fs.stat(absolutePath);
  }

  async zipStats({ absolutePath }: { absolutePath: string }) {
    if (!fs.pathExistsSync(absolutePath)) {
      throw new ServiceError({ reason: "Invalid File Path", origin: "File" });
    }

    const size = fs.statSync(absolutePath).size;
    const fileCount = new AdmZip(absolutePath)
      .getEntries()
      .filter((entry) => !entry.isDirectory).length;

    return {
      size,
      fileCount,
    };
  }
}

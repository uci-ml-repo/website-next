import type { PrismaClient } from "@prisma/client";
import fs from "fs-extra";

export default class FileFindService {
  constructor(readonly prisma: PrismaClient) {}

  async list(path: string) {
    const nodes = await fs.readdir(path, { withFileTypes: true });

    return nodes
      .map((node) => ({
        name: node.name,
        path: path,
        isFile: node.isFile(),
        isDirectory: node.isDirectory(),
        extension:
          node.isFile() && node.name.includes(".")
            ? node.name.split(".").pop()
            : undefined,
      }))
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) {
          return -1;
        } else if (!a.isDirectory && b.isDirectory) {
          return 1;
        }

        return a.name.localeCompare(b.name);
      });
  }
}

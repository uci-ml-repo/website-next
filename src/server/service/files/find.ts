import type { PrismaClient } from "@prisma/client";
import fs from "fs-extra";
import path from "path";

type DirectoryEntityType = "directory" | "file" | null;

export interface DirectoryEntity {
  name: string;
  path: string;
  type: DirectoryEntityType;
  extension?: string;
}

function nodeToDirectoryEntity(
  node: fs.Dirent,
  absolutePath: string,
): DirectoryEntity {
  return {
    name: node.name,
    path: path.join(
      absolutePath.slice(
        fs.realpathSync(process.env.STATIC_FILES_DIRECTORY!).length,
      ),
      node.name,
    ),
    type: node.isDirectory() ? "directory" : node.isFile() ? "file" : null,
    extension:
      node.isFile() && node.name.includes(".")
        ? node.name.split(".").pop()
        : undefined,
  };
}

export default class FileFindService {
  constructor(readonly prisma: PrismaClient) {}

  async list(absolutePath: string) {
    const nodes = await fs.readdir(absolutePath, { withFileTypes: true });

    return nodes
      .map((node) => nodeToDirectoryEntity(node, absolutePath))
      .sort((a, b) => {
        if (a.type === "directory" && !(b.type === "directory")) {
          return -1;
        } else if (!(a.type === "directory") && b.type === "directory") {
          return 1;
        }

        return a.name.localeCompare(b.name);
      });
  }
}

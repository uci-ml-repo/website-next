import type { PrismaClient } from "@prisma/client";
import fs from "fs-extra";
import path from "path";

type DirectoryEntityType = "directory" | "file" | null;

export interface DirectoryEntity {
  path: string;
  type: DirectoryEntityType;
}

function nodeToDirectoryEntity(
  node: fs.Dirent,
  absolutePath: string,
): DirectoryEntity {
  return {
    path: path.join(
      absolutePath.slice(
        fs.realpathSync(process.env.STATIC_FILES_DIRECTORY!).length,
      ),
      node.name,
    ),
    type: node.isDirectory() ? "directory" : node.isFile() ? "file" : null,
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

        return path.basename(a.path).localeCompare(path.basename(b.path));
      });
  }
}

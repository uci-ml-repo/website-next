import fg from "fast-glob";
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
  if (!process.env.STATIC_FILES_DIRECTORY) {
    throw new Error("STATIC_FILES_DIRECTORY is not set");
  }

  return {
    path: path.join(
      absolutePath.slice(
        fs.realpathSync(process.env.STATIC_FILES_DIRECTORY).length,
      ),
      node.name,
    ),
    type: node.isDirectory() ? "directory" : node.isFile() ? "file" : null,
  };
}

function sortDirectoryEntities(a: DirectoryEntity, b: DirectoryEntity) {
  if (a.type === "directory" && b.type !== "directory") {
    return -1;
  } else if (a.type !== "directory" && b.type === "directory") {
    return 1;
  }

  return path.basename(a.path).localeCompare(path.basename(b.path));
}

export class FileFindService {
  async list(absolutePath: string) {
    const nodes = await fs.readdir(absolutePath, { withFileTypes: true });

    return nodes
      .map((node) => nodeToDirectoryEntity(node, absolutePath))
      .sort(sortDirectoryEntities);
  }

  async search(
    absolutePath: string,
    search: string,
  ): Promise<DirectoryEntity[]> {
    if (!process.env.STATIC_FILES_DIRECTORY) {
      throw new Error("STATIC_FILES_DIRECTORY is not set");
    }

    const filePaths = await fg(`${absolutePath}/**/*${search}*`, {
      caseSensitiveMatch: false,
      dot: true,
    });

    const directoryEntities: DirectoryEntity[] = [];
    for (const filePath of filePaths) {
      const stat = await fs.stat(filePath);
      directoryEntities.push({
        path: filePath.slice(
          fs.realpathSync(process.env.STATIC_FILES_DIRECTORY).length,
        ),
        type: stat.isDirectory() ? "directory" : stat.isFile() ? "file" : null,
      });
    }

    directoryEntities.sort(sortDirectoryEntities);

    return directoryEntities;
  }

  async exists(absolutePath: string) {
    return fs.pathExists(absolutePath);
  }
}

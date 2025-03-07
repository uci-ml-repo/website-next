import "server-only";

import path from "path";

export function absoluteStaticPath(relativePath: string | string[]) {
  if (!process.env.STATIC_FILES_DIRECTORY) {
    throw new Error("STATIC_FILES_DIRECTORY is not set");
  }

  if (Array.isArray(relativePath)) {
    return path.join(process.env.STATIC_FILES_DIRECTORY, ...relativePath);
  }
  return path.join(process.env.STATIC_FILES_DIRECTORY, relativePath);
}

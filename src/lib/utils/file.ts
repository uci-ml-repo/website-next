import "server-only";

import path from "path";

import { env } from "@/env";

export function absoluteStaticPath(relativePath: string | string[]) {
  if (Array.isArray(relativePath)) {
    return path.join(env.STATIC_FILES_DIRECTORY, ...relativePath);
  }
  return path.join(env.STATIC_FILES_DIRECTORY, relativePath);
}

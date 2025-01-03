/**
 * Checks if the given relative path accesses 'private'.
 *
 * @param path - The relative path to check.
 * @returns `true` if the path accesses 'private', otherwise, `false`.
 */
export function relativePathIsProtected(path: string): boolean {
  if (!path) return false;

  const trimmedPath = path.replace(/^\/+/g, "");
  const segments = trimmedPath.split("/");
  return segments[0] === "private";
}

export const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".bmp",
  ".ico",
  ".apng",
];

export const tabularToDelimiter: Record<string, string | RegExp> = {
  ".tsv": "\t",
  ".csv": ",",
  ".data": /[, ]/,
};

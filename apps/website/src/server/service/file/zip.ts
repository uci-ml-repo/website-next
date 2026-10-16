const MAX_DIRECTORY_SIZE = 4 * 1024 * 1024;
const MAX_ENTRIES = 10_000;

export function zipDirectoryLocation(tail: Buffer, archiveSize: number) {
  for (let offset = tail.length - 22; offset >= 0; offset--) {
    if (tail.readUInt32LE(offset) !== 0x06054b50) continue;
    if (offset + 22 + tail.readUInt16LE(offset + 20) !== tail.length) continue;

    const entries = tail.readUInt16LE(offset + 10);
    const size = tail.readUInt32LE(offset + 12);
    const start = tail.readUInt32LE(offset + 16);
    if (
      tail.readUInt16LE(offset + 4) !== 0 ||
      tail.readUInt16LE(offset + 6) !== 0 ||
      tail.readUInt16LE(offset + 8) !== entries ||
      entries === 0 ||
      entries > MAX_ENTRIES ||
      size === 0 ||
      size > MAX_DIRECTORY_SIZE ||
      start + size !== archiveSize - tail.length + offset
    ) {
      throw new Error(
        "Use a standard ZIP archive with 1–10,000 entries, without split volumes or ZIP64",
      );
    }

    return { start, size, entries };
  }

  throw new Error("The uploaded file is not a valid ZIP archive");
}

export function countZipFiles(directory: Buffer, entries: number) {
  let offset = 0;
  let files = 0;
  for (let index = 0; index < entries; index++) {
    if (offset + 46 > directory.length || directory.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("The ZIP archive directory is invalid");
    }

    const nameLength = directory.readUInt16LE(offset + 28);
    const extraLength = directory.readUInt16LE(offset + 30);
    const commentLength = directory.readUInt16LE(offset + 32);
    const end = offset + 46 + nameLength + extraLength + commentLength;
    if (!nameLength || end > directory.length) {
      throw new Error("The ZIP archive directory is incomplete");
    }

    const name = directory.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    if (
      directory.readUInt16LE(offset + 8) & 1 ||
      name.startsWith("/") ||
      name.includes("\\") ||
      name.includes("\0") ||
      /^[a-z]:/i.test(name) ||
      name.split("/").includes("..")
    ) {
      throw new Error("ZIP archives cannot contain encrypted files or unsafe file paths");
    }

    if (!name.endsWith("/")) files++;
    offset = end;
  }

  if (offset !== directory.length || !files) {
    throw new Error("The ZIP archive must contain at least one file and a valid directory");
  }

  return files;
}

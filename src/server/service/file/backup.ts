import { TRPCError } from "@trpc/server";
import fs from "fs-extra";
import path from "path";

export class FileBackupService {
  async renameToBackup({
    absolutePath,
    overwrite,
  }: {
    absolutePath: string;
    overwrite?: boolean;
  }) {
    const { dir, name, ext } = path.parse(absolutePath);
    const backupPath = path.join(dir, `${name}.bak${ext}`);

    const backupExists = await fs.pathExists(backupPath);
    if (backupExists) {
      if (overwrite) {
        await fs.remove(backupPath);
      } else {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Backup already exists",
        });
      }
    }

    await fs.rename(absolutePath, backupPath);
  }

  async renameToRestore({
    absolutePath,
    overwrite,
  }: {
    absolutePath: string;
    overwrite?: boolean;
  }) {
    const { dir, name, ext } = path.parse(absolutePath);
    const backupPath = path.join(dir, `${name}.bak${ext}`);

    const originalExists = await fs.pathExists(absolutePath);
    if (originalExists) {
      if (overwrite) {
        await fs.remove(absolutePath);
      } else {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Original file already exists",
        });
      }
    }

    await fs.rename(backupPath, absolutePath);
  }
}

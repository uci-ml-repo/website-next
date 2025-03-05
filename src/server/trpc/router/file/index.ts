import { router } from "@/server/trpc";
import { fileBackupRouter } from "@/server/trpc/router/file/backup";
import { fileFindRouter } from "@/server/trpc/router/file/find";
import { fileReadRouter } from "@/server/trpc/router/file/read";
import { fileZipRouter } from "@/server/trpc/router/file/zip";

export const fileRouter = router({
  backup: fileBackupRouter,
  find: fileFindRouter,
  read: fileReadRouter,
  zip: fileZipRouter,
});

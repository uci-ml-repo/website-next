import { router } from "@/server/trpc";
import { fileFindRouter } from "@/server/trpc/router/file/find";
import { fileReadRouter } from "@/server/trpc/router/file/read";
import { fileUploadRouter } from "@/server/trpc/router/file/upload";

export const fileRouter = router({
  find: fileFindRouter,
  read: fileReadRouter,
  upload: fileUploadRouter,
});

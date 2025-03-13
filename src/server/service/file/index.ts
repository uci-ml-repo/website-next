import { fileBackupService } from "@/server/service/file/backup";
import { fileFindService } from "@/server/service/file/find";
import { fileReadService } from "@/server/service/file/read";
import { fileZipService } from "@/server/service/file/zip";

export namespace fileService {
  export const backup = fileBackupService;
  export const find = fileFindService;
  export const read = fileReadService;
  export const zip = fileZipService;
}

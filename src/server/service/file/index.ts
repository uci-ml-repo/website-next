import { FileFindService } from "@/server/service/file/find";
import { FileReadService } from "@/server/service/file/read";
import { FileZipService } from "@/server/service/file/zip";

export class FileService {
  constructor(
    readonly find = new FileFindService(),
    readonly read = new FileReadService(),
    readonly zip = new FileZipService(),
  ) {}
}

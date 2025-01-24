import FileFindService from "@/server/service/file/find";
import FileReadService from "@/server/service/file/read";

export default class FileService {
  constructor(
    readonly find = new FileFindService(),
    readonly read = new FileReadService(),
  ) {}
}

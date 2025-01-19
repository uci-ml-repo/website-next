import FilesFindService from "@/server/service/files/find";
import FilesReadService from "@/server/service/files/read";

export default class FilesService {
  constructor(
    readonly find = new FilesFindService(),
    readonly read = new FilesReadService(),
  ) {}
}

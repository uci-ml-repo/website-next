import { editCreateService } from "@/server/service/edit/create";
import { editFindService } from "@/server/service/edit/find";

export namespace editService {
  export const create = editCreateService;
  export const find = editFindService;
}

import { EditCreateService } from "@/server/service/edit/create";
import { EditFindService } from "@/server/service/edit/find";

export class EditService {
  constructor(
    readonly create = new EditCreateService(),
    readonly find = new EditFindService(),
  ) {}
}

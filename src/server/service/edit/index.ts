import { EditFindService } from "@/server/service/edit/find";

export class EditService {
  constructor(readonly find = new EditFindService()) {}
}

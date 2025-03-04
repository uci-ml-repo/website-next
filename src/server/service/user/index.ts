import { UserCredentialsService } from "@/server/service/user/credentials";
import { UserFindService } from "@/server/service/user/find";
import { UserRemoveService } from "@/server/service/user/remove";
import { UserUpdateService } from "@/server/service/user/update";

export class UserService {
  constructor(
    readonly credentials = new UserCredentialsService(),
    readonly find = new UserFindService(),
    readonly remove = new UserRemoveService(),
    readonly update = new UserUpdateService(),
  ) {}
}

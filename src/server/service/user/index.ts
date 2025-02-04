import UserFindService from "@/server/service/user/find";
import UserUpdateService from "@/server/service/user/update";

export default class UserService {
  constructor(
    readonly find = new UserFindService(),
    readonly update = new UserUpdateService(),
  ) {}
}

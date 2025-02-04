import UserFindService from "@/server/service/user/find";
import UserPasswordService from "@/server/service/user/password";
import UserUpdateService from "@/server/service/user/update";

export default class UserService {
  constructor(
    readonly find = new UserFindService(),
    readonly update = new UserUpdateService(),
    readonly password = new UserPasswordService(),
  ) {}
}

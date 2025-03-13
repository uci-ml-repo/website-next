import { userCredentialsService } from "@/server/service/user/credentials";
import { userFindService } from "@/server/service/user/find";
import { userRemoveService } from "@/server/service/user/remove";
import { userUpdateService } from "@/server/service/user/update";

export namespace userService {
  export const credentials = userCredentialsService;
  export const find = userFindService;
  export const remove = userRemoveService;
  export const update = userUpdateService;
}

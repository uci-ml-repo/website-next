import { userFindService } from "@/server/service/user/find";
import { userUpdateService } from "@/server/service/user/update";

export const userService = {
  find: userFindService,
  update: userUpdateService,
};

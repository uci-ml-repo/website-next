import { datasetService } from "@/server/service/dataset";
import { userService } from "@/server/service/user";

export const service = {
  user: userService,
  dataset: datasetService,
};

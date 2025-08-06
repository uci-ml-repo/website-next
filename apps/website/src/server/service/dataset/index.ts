import { datasetFindService } from "@/server/service/dataset/find";
import { datasetStatService } from "@/server/service/dataset/stat";

export const datasetService = {
  find: datasetFindService,
  stat: datasetStatService,
};

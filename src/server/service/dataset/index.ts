import { datasetCiteService } from "@/server/service/dataset/cite";
import { datasetCountService } from "@/server/service/dataset/count";
import { datasetCreateService } from "@/server/service/dataset/create";
import { datasetFileService } from "@/server/service/dataset/file";
import { datasetFindService } from "@/server/service/dataset/find";
import { datasetRemoveService } from "@/server/service/dataset/remove";
import { datasetStatsService } from "@/server/service/dataset/stats";
import { datasetUpdateService } from "@/server/service/dataset/update";

export namespace datasetService {
  export const cite = datasetCiteService;
  export const count = datasetCountService;
  export const create = datasetCreateService;
  export const file = datasetFileService;
  export const find = datasetFindService;
  export const remove = datasetRemoveService;
  export const stats = datasetStatsService;
  export const update = datasetUpdateService;
}

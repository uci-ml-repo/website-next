import { DatasetCiteService } from "@/server/service/dataset/cite";
import { DatasetCountService } from "@/server/service/dataset/count";
import { DatasetCreateService } from "@/server/service/dataset/create";
import { DatasetFindService } from "@/server/service/dataset/find";
import { DatasetRemoveService } from "@/server/service/dataset/remove";
import { DatasetReportService } from "@/server/service/dataset/report";
import { DatasetStatsService } from "@/server/service/dataset/stats";
import { DatasetUpdateService } from "@/server/service/dataset/update";

export class DatasetService {
  constructor(
    readonly cite = new DatasetCiteService(),
    readonly count = new DatasetCountService(),
    readonly create = new DatasetCreateService(),
    readonly find = new DatasetFindService(),
    readonly remove = new DatasetRemoveService(),
    readonly report = new DatasetReportService(),
    readonly stats = new DatasetStatsService(),
    readonly update = new DatasetUpdateService(),
  ) {}
}

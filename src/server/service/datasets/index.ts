import DatasetsCiteService from "@/server/service/datasets/cite";
import DatasetsCountService from "@/server/service/datasets/count";
import DatasetsFindService from "@/server/service/datasets/find";
import DatasetsReportService from "@/server/service/datasets/report";

export default class DatasetsService {
  constructor(
    readonly find = new DatasetsFindService(),
    readonly cite = new DatasetsCiteService(),
    readonly count = new DatasetsCountService(),
    readonly report = new DatasetsReportService(),
  ) {}
}

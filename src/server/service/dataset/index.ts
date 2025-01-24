import DatasetCiteService from "@/server/service/dataset/cite";
import DatasetCountService from "@/server/service/dataset/count";
import DatasetFindService from "@/server/service/dataset/find";
import DatasetReportService from "@/server/service/dataset/report";

export default class DatasetService {
  constructor(
    readonly find = new DatasetFindService(),
    readonly cite = new DatasetCiteService(),
    readonly count = new DatasetCountService(),
    readonly report = new DatasetReportService(),
  ) {}
}

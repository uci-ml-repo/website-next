import { datasetDonationService } from "@/server/service/dataset/donation";
import { datasetFindService } from "@/server/service/dataset/find";
import { datasetStatService } from "@/server/service/dataset/stat";

export const datasetService = {
  donation: datasetDonationService,
  find: datasetFindService,
  stat: datasetStatService,
};

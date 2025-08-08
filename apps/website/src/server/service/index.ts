import { datasetService } from "@/server/service/dataset";
import { featureService } from "@/server/service/feature";
import { keywordService } from "@/server/service/keyword";
import { userService } from "@/server/service/user";

export const service = {
  dataset: datasetService,
  keyword: keywordService,
  feature: featureService,
  user: userService,
};

import { datasetService } from "@/server/service/dataset";
import { keywordService } from "@/server/service/keyword";
import { userService } from "@/server/service/user";

export const service = {
  dataset: datasetService,
  keyword: keywordService,
  user: userService,
};

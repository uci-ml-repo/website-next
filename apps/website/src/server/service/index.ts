import { bookmarkService } from "@/server/service/bookmark";
import { datasetService } from "@/server/service/dataset";
import { featureService } from "@/server/service/feature";
import { fileService } from "@/server/service/file";
import { keywordService } from "@/server/service/keyword";
import { userService } from "@/server/service/user";

export const service = {
  dataset: datasetService,
  keyword: keywordService,
  feature: featureService,
  file: fileService,
  bookmark: bookmarkService,
  user: userService,
};

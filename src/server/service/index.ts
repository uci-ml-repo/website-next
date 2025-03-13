import { attributeService } from "@/server/service/attribute";
import { bookmarkService } from "@/server/service/bookmark";
import { datasetService } from "@/server/service/dataset";
import { discussionService } from "@/server/service/discussion";
import { editService } from "@/server/service/edit";
import { EmailService } from "@/server/service/email";
import { fileService } from "@/server/service/file";
import { keywordService } from "@/server/service/keyword";
import { reportService } from "@/server/service/report";
import { userService } from "@/server/service/user";

export namespace service {
  export const attribute = attributeService;
  export const bookmark = bookmarkService;
  export const dataset = datasetService;
  export const discussion = discussionService;
  export const edit = editService;
  export const email = new EmailService();
  export const file = fileService;
  export const keyword = keywordService;
  export const report = reportService;
  export const user = userService;
}

import { reportDatasetService } from "@/server/service/report/dataset";
import { reportDiscussionService } from "@/server/service/report/discussion";
import { reportDiscussionCommentService } from "@/server/service/report/discussion-comment";
import { reportFindService } from "@/server/service/report/find";

export namespace reportService {
  export const dataset = reportDatasetService;
  export const discussion = reportDiscussionService;
  export const discussionComment = reportDiscussionCommentService;
  export const find = reportFindService;
}

import { ReportDatasetService } from "@/server/service/report/dataset";
import { ReportDiscussionService } from "@/server/service/report/discussion";
import { ReportDiscussionCommentService } from "@/server/service/report/discussion-comment";
import { ReportFindService } from "@/server/service/report/find";

export class ReportService {
  constructor(
    readonly dataset = new ReportDatasetService(),
    readonly discussion = new ReportDiscussionService(),
    readonly discussionComment = new ReportDiscussionCommentService(),
    readonly find = new ReportFindService(),
  ) {}
}

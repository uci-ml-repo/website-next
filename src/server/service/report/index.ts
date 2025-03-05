import { ReportDatasetService } from "@/server/service/report/dataset";
import { ReportDiscussionService } from "@/server/service/report/discussion";
import { ReportDiscussionCommentService } from "@/server/service/report/discussion-comment";

export class ReportService {
  constructor(
    readonly dataset = new ReportDatasetService(),
    readonly discussion = new ReportDiscussionService(),
    readonly discussionComment = new ReportDiscussionCommentService(),
  ) {}
}

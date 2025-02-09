import { DiscussionCommentService } from "@/server/service/discussion/comment";
import { DiscussionCreateService } from "@/server/service/discussion/create";
import { DiscussionFindService } from "@/server/service/discussion/find";
import { DiscussionRemoveService } from "@/server/service/discussion/remove";
import { DiscussionReportService } from "@/server/service/discussion/report";
import { DiscussionUpdateService } from "@/server/service/discussion/update";
import { DiscussionUpvoteService } from "@/server/service/discussion/upvote";

export class DiscussionService {
  constructor(
    readonly comment = new DiscussionCommentService(),
    readonly create = new DiscussionCreateService(),
    readonly find = new DiscussionFindService(),
    readonly remove = new DiscussionRemoveService(),
    readonly report = new DiscussionReportService(),
    readonly update = new DiscussionUpdateService(),
    readonly upvote = new DiscussionUpvoteService(),
  ) {}
}

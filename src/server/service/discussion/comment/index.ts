import { DiscussionCommentCreateService } from "@/server/service/discussion/comment/create";
import { DiscussionCommentFindService } from "@/server/service/discussion/comment/find";
import { DiscussionCommentRemoveService } from "@/server/service/discussion/comment/remove";
import { DiscussionCommentReportService } from "@/server/service/discussion/comment/report";
import { DiscussionCommentUpdateService } from "@/server/service/discussion/comment/update";
import { DiscussionCommentUpvoteService } from "@/server/service/discussion/comment/upvote";

export class DiscussionCommentService {
  constructor(
    readonly create = new DiscussionCommentCreateService(),
    readonly find = new DiscussionCommentFindService(),
    readonly remove = new DiscussionCommentRemoveService(),
    readonly report = new DiscussionCommentReportService(),
    readonly update = new DiscussionCommentUpdateService(),
    readonly upvote = new DiscussionCommentUpvoteService(),
  ) {}
}

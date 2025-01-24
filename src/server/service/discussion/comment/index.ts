import DiscussionCommentCreateService from "@/server/service/discussion/comment/create";
import DiscussionCommentFindService from "@/server/service/discussion/comment/find";
import DiscussionCommentRemoveService from "@/server/service/discussion/comment/remove";
import DiscussionCommentReportService from "@/server/service/discussion/comment/report";
import DiscussionCommentUpdateService from "@/server/service/discussion/comment/update";
import DiscussionCommentUpvoteService from "@/server/service/discussion/comment/upvote";

export default class DiscussionCommentService {
  constructor(
    readonly find = new DiscussionCommentFindService(),
    readonly create = new DiscussionCommentCreateService(),
    readonly remove = new DiscussionCommentRemoveService(),
    readonly upvote = new DiscussionCommentUpvoteService(),
    readonly update = new DiscussionCommentUpdateService(),
    readonly report = new DiscussionCommentReportService(),
  ) {}
}

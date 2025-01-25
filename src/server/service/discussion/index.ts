import DiscussionCommentService from "@/server/service/discussion/comment";
import DiscussionCountService from "@/server/service/discussion/count";
import DiscussionCreateService from "@/server/service/discussion/create";
import DiscussionUpdateService from "@/server/service/discussion/edit";
import DiscussionFindService from "@/server/service/discussion/find";
import DiscussionRemoveService from "@/server/service/discussion/remove";
import DiscussionReportService from "@/server/service/discussion/report";
import DiscussionUpvoteService from "@/server/service/discussion/upvote";

export default class DiscussionService {
  constructor(
    readonly comment = new DiscussionCommentService(),
    readonly find = new DiscussionFindService(),
    readonly count = new DiscussionCountService(),
    readonly update = new DiscussionUpdateService(),
    readonly create = new DiscussionCreateService(),
    readonly remove = new DiscussionRemoveService(),
    readonly upvote = new DiscussionUpvoteService(),
    readonly report = new DiscussionReportService(),
  ) {}
}

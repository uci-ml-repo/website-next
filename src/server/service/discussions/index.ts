import DiscussionsCreateService from "@/server/service/discussions/create";
import DiscussionsEditService from "@/server/service/discussions/edit";
import DiscussionsFindService from "@/server/service/discussions/find";
import DiscussionsRemoveService from "@/server/service/discussions/remove";
import DiscussionsReportService from "@/server/service/discussions/report";
import DiscussionsUpvoteService from "@/server/service/discussions/upvote";

export default class DiscussionsService {
  constructor(
    readonly find = new DiscussionsFindService(),
    readonly edit = new DiscussionsEditService(),
    readonly create = new DiscussionsCreateService(),
    readonly remove = new DiscussionsRemoveService(),
    readonly upvote = new DiscussionsUpvoteService(),
    readonly report = new DiscussionsReportService(),
  ) {}
}

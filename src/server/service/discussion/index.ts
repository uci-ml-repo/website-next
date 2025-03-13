import { discussionCommentService } from "@/server/service/discussion/comment";
import { discussionCreateService } from "@/server/service/discussion/create";
import { discussionFindService } from "@/server/service/discussion/find";
import { discussionRemoveService } from "@/server/service/discussion/remove";
import { discussionUpdateService } from "@/server/service/discussion/update";
import { discussionUpvoteService } from "@/server/service/discussion/upvote";

export namespace discussionService {
  export const comment = discussionCommentService;
  export const create = discussionCreateService;
  export const find = discussionFindService;
  export const remove = discussionRemoveService;
  export const update = discussionUpdateService;
  export const upvote = discussionUpvoteService;
}

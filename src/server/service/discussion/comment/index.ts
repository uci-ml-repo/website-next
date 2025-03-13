import { discussionCommentCreateService } from "@/server/service/discussion/comment/create";
import { discussionCommentFindService } from "@/server/service/discussion/comment/find";
import { discussionCommentRemoveService } from "@/server/service/discussion/comment/remove";
import { discussionCommentUpdateService } from "@/server/service/discussion/comment/update";
import { discussionCommentUpvoteService } from "@/server/service/discussion/comment/upvote";

export namespace discussionCommentService {
  export const create = discussionCommentCreateService;
  export const find = discussionCommentFindService;
  export const remove = discussionCommentRemoveService;
  export const update = discussionCommentUpdateService;
  export const upvote = discussionCommentUpvoteService;
}

import { router } from "@/server/trpc";
import { reportDatasetRouter } from "@/server/trpc/router/report/dataset";
import { reportDiscussionRouter } from "@/server/trpc/router/report/discussion";
import { reportDiscussionCommentRouter } from "@/server/trpc/router/report/discussion-comment";
import { reportFindRouter } from "@/server/trpc/router/report/find";

export const reportRouter = router({
  dataset: reportDatasetRouter,
  discussion: reportDiscussionRouter,
  discussionComment: reportDiscussionCommentRouter,
  find: reportFindRouter,
});

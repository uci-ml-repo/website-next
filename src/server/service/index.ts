import "server-only";

import BookmarkService from "@/server/service/bookmark";
import DatasetService from "@/server/service/dataset";
import DiscussionService from "@/server/service/discussion";
import FileService from "@/server/service/file";
import UserService from "@/server/service/user";

class RepositoryService {
  constructor(
    readonly dataset = new DatasetService(),
    readonly discussion = new DiscussionService(),
    readonly file = new FileService(),
    readonly bookmark = new BookmarkService(),
    readonly user = new UserService(),
  ) {}
}

const service = new RepositoryService();

export default service;

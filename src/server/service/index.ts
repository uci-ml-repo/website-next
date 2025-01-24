import BookmarkService from "@/server/service/bookmark";
import DatasetService from "@/server/service/dataset";
import DiscussionService from "@/server/service/discussion";
import FileService from "@/server/service/file";

class RepositoryService {
  constructor(
    readonly dataset = new DatasetService(),
    readonly discussion = new DiscussionService(),
    readonly file = new FileService(),
    readonly bookmark = new BookmarkService(),
  ) {}
}

const service = new RepositoryService();

export default service;

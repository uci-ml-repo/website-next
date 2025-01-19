import BookmarksService from "@/server/service/bookmarks";
import DatasetsService from "@/server/service/datasets";
import DiscussionsService from "@/server/service/discussions";
import FilesService from "@/server/service/files";

class RepositoryService {
  constructor(
    readonly datasets = new DatasetsService(),
    readonly discussions = new DiscussionsService(),
    readonly files = new FilesService(),
    readonly bookmarks = new BookmarksService(),
  ) {}
}

const service = new RepositoryService();

export default service;

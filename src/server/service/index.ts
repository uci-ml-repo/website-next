import BookmarkService from "@/server/service/bookmark";
import DatasetService from "@/server/service/dataset";
import DiscussionService from "@/server/service/discussion";
import EmailSendService from "@/server/service/email/send";
import FileService from "@/server/service/file";
import KeywordService from "@/server/service/keyword";
import UserService from "@/server/service/user";

class RepositoryService {
  constructor(
    readonly dataset = new DatasetService(),
    readonly discussion = new DiscussionService(),
    readonly file = new FileService(),
    readonly bookmark = new BookmarkService(),
    readonly keyword = new KeywordService(),
    readonly user = new UserService(),
    readonly email = new EmailSendService(),
  ) {}
}

const service = new RepositoryService();

export default service;

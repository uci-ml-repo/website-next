import { AttributeService } from "@/server/service/attribute";
import { BookmarkService } from "@/server/service/bookmark";
import { DatasetService } from "@/server/service/dataset";
import { DiscussionService } from "@/server/service/discussion";
import { EmailSendService } from "@/server/service/email/send";
import { FileService } from "@/server/service/file";
import { KeywordService } from "@/server/service/keyword";
import { UserService } from "@/server/service/user";

class RepositoryService {
  constructor(
    readonly attribute = new AttributeService(),
    readonly bookmark = new BookmarkService(),
    readonly dataset = new DatasetService(),
    readonly discussion = new DiscussionService(),
    readonly email = new EmailSendService(),
    readonly file = new FileService(),
    readonly keyword = new KeywordService(),
    readonly user = new UserService(),
  ) {}
}

export const service = new RepositoryService();

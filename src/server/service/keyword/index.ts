import { KeywordFindService } from "@/server/service/keyword/find";

export class KeywordService {
  constructor(readonly find = new KeywordFindService()) {}
}

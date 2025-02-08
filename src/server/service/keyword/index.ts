import KeywordFindService from "@/server/service/keyword/find";

export default class KeywordService {
  constructor(readonly find = new KeywordFindService()) {}
}

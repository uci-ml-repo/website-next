import { AttributeFindService } from "@/server/service/attribute/find";

export class AttributeService {
  constructor(readonly find = new AttributeFindService()) {}
}

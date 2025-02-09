import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { keyword } from "@/db/schema";

export class KeywordFindService {
  async approved() {
    return db
      .select()
      .from(keyword)
      .where(eq(keyword.status, Enums.Status.APPROVED));
  }
}

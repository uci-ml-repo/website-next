import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { keyword } from "@/db/schema";

export class KeywordFindService {
  async approved() {
    const keywords = await db
      .select({
        name: keyword.name,
      })
      .from(keyword)
      .where(eq(keyword.status, Enums.ApprovalStatus.APPROVED));

    return keywords.map((row) => row.name);
  }
}

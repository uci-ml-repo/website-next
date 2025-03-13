import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { keyword } from "@/db/schema";

export namespace keywordFindService {
  export async function approved() {
    const keywords = await db
      .select({
        name: keyword.name,
      })
      .from(keyword)
      .where(eq(keyword.status, Enums.ApprovalStatus.APPROVED));

    return keywords.map((row) => row.name);
  }
}

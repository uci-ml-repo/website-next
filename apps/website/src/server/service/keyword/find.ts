import { db } from "@packages/db";
import { Enums } from "@packages/db/enum";
import { keyword } from "@packages/db/schema";
import { asc, eq } from "drizzle-orm";

async function approved() {
  const keywords = await db
    .select({
      name: keyword.name,
    })
    .from(keyword)
    .where(eq(keyword.status, Enums.ApprovalStatus.APPROVED))
    .orderBy(asc(keyword.name));

  return keywords.map((row) => row.name);
}

export const keywordFindService = {
  approved,
};

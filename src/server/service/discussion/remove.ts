import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion } from "@/db/schema";

export namespace discussionRemoveService {
  export async function byId({ discussionId }: { discussionId: string }) {
    return db.delete(discussion).where(eq(discussion.id, discussionId)).returning();
  }
}

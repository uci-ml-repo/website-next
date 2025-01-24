import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion } from "@/db/schema";

export default class DiscussionEditService {
  async byId({ id, content }: { id: string; content: string }) {
    return db.update(discussion).set({ content }).where(eq(discussion.id, id));
  }
}

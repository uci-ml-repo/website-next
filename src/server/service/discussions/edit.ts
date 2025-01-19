import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussions } from "@/db/schema";

export default class DiscussionsEditService {
  async byId({ id, content }: { id: string; content: string }) {
    return db
      .update(discussions)
      .set({ content })
      .where(eq(discussions.id, id));
  }
}

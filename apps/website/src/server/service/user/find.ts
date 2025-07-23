import { db } from "@packages/db";
import { user } from "@packages/db/schema";
import { eq } from "drizzle-orm";

function byId(id: string) {
  return db.select().from(user).where(eq(user.id, id));
}

export const userFindService = { byId };

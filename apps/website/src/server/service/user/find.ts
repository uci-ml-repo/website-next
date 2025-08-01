import { db } from "@packages/db";
import { user } from "@packages/db/schema";
import { eq } from "drizzle-orm";

async function byId(id: string) {
  const [result] = await db.select().from(user).where(eq(user.id, id));
  return result;
}

async function byEmail(email: string) {
  const [result] = await db.select().from(user).where(eq(user.email, email));
  return result;
}

export const userFindService = { byId, byEmail };

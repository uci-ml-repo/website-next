import { db } from "@packages/db";
import { dataset } from "@packages/db/schema";
import { eq } from "drizzle-orm";

async function byId(id: number) {
  const [result] = await db.select().from(dataset).where(eq(dataset.id, id));
  return result;
}

export const userFindService = { byId };

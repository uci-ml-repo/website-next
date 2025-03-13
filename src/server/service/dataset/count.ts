import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { dataset } from "@/db/schema";

export namespace datasetCountService {
  export async function approved() {
    return db
      .select({ count: count() })
      .from(dataset)
      .where(eq(dataset.status, Enums.ApprovalStatus.APPROVED));
  }
}

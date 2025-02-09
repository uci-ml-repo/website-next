import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/enums";
import { dataset } from "@/db/schema";

export class DatasetCountService {
  async approved() {
    return db
      .select({ count: count() })
      .from(dataset)
      .where(eq(dataset.status, Enums.ApprovalStatus.APPROVED));
  }
}

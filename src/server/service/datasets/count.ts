import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { datasets } from "@/db/schema";
import { Enums } from "@/db/types";

export default class DatasetsCountService {
  async approved() {
    return db
      .select({ count: count() })
      .from(datasets)
      .where(eq(datasets.status, Enums.DatasetStatus.APPROVED));
  }
}

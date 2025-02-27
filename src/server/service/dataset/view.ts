import { sql } from "drizzle-orm";

import { db } from "@/db";

export class DatasetViewService {
  async refresh(id?: number) {
    db.execute(sql`
      SELECT
        refresh_dataset_view (${id})
    `);
  }
}

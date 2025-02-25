import { desc, ilike } from "drizzle-orm";
import fs from "fs-extra";
import path from "path";
import slugify from "slugify";

import { db } from "@/db";
import { dataset, datasetView } from "@/db/schema";
import { DATASET_RELATIVE_PATH } from "@/lib/routes";

export class DatasetCreateService {
  async initial({ title, userId }: { title: string; userId: string }) {
    if (!process.env.STATIC_FILES_DIRECTORY) {
      throw new Error("Storage path is not defined");
    }

    const baseSlug = slugify(title, { replacement: "+", lower: true });

    const existingSlugs = await db
      .select({ slug: dataset.slug })
      .from(dataset)
      .where(ilike(dataset.slug, baseSlug + "%"))
      .orderBy(desc(dataset.slug))
      .then((slugs) => slugs.map((s) => s.slug));

    const modifier = existingSlugs.reduce((max, slug) => {
      if (slug === baseSlug) return Math.max(max, 0);
      const parts = slug.split("-");
      const num = parseInt(parts[parts.length - 1], 10);
      return !isNaN(num) ? Math.max(max, num) : max;
    }, -1);

    const slug = modifier === -1 ? baseSlug : `${baseSlug}-${modifier + 1}`;

    const [createdDataset] = await db
      .insert(dataset)
      .values({ title, userId, slug })
      .returning();

    await db.refreshMaterializedView(datasetView).concurrently();

    const directoryPath = path.join(
      process.env.STATIC_FILES_DIRECTORY,
      DATASET_RELATIVE_PATH(createdDataset),
    );

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }

    return createdDataset;
  }
}

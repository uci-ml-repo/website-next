import { desc, ilike } from "drizzle-orm";
import fs from "fs-extra";
import path from "path";
import slugify from "slugify";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import { DATASET_FILES_PATH } from "@/lib/routes";
import { service } from "@/server/service";

export class DatasetCreateService {
  async draft({ title, userId }: { title: string; userId: string }) {
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

    const createdDataset = await db.transaction(async (tx) => {
      if (!process.env.STATIC_FILES_DIRECTORY) {
        throw new Error("Storage path is not defined");
      }

      const [createdDataset] = await tx
        .insert(dataset)
        .values({ title, userId, slug })
        .returning();

      const directoryPath = path.join(
        process.env.STATIC_FILES_DIRECTORY,
        DATASET_FILES_PATH(createdDataset),
      );

      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      return createdDataset;
    });

    await service.dataset.update.refreshView(createdDataset.id);

    return createdDataset;
  }
}

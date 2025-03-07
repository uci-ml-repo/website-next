import { desc, ilike } from "drizzle-orm";
import fs from "fs-extra";
import slugify from "slugify";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import { DATASET_FILES_PATH } from "@/lib/routes";
import { absoluteStaticPath } from "@/lib/utils/file";
import { service } from "@/server/service";

export class DatasetCreateService {
  async getSlug(title: string) {
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

    return slug;
  }

  async draft({
    title,
    externalLink,
    userId,
  }: {
    title: string;
    externalLink?: string;
    userId: string;
  }) {
    const createdDataset = await db.transaction(async (tx) => {
      if (!process.env.STATIC_FILES_DIRECTORY) {
        throw new Error("Storage path is not defined");
      }

      const slug = await this.getSlug(title);

      const [createdDataset] = await tx
        .insert(dataset)
        .values({
          title,
          externalLink,
          userId,
          slug,
          downloadCount: externalLink ? null : 0,
        })
        .returning();

      const directoryPath = absoluteStaticPath(
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

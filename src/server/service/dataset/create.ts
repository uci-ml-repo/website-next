import { desc, ilike } from "drizzle-orm";
import slugify from "slugify";

import { db } from "@/db";
import { dataset } from "@/db/schema";

export class DatasetCreateService {
  async initial({ title, userId }: { title: string; userId: string }) {
    const baseSlug = slugify(title, { replacement: "+", lower: true });

    const existingSlugs = await db
      .select({ slug: dataset.slug })
      .from(dataset)
      .where(ilike(dataset.slug, baseSlug))
      .orderBy(desc(dataset.slug))
      .then((slugs) => slugs.map((s) => s.slug));

    const modifier = existingSlugs.reduce((max, slug) => {
      if (slug === baseSlug) return Math.max(max, 0);
      const parts = slug.split("-");
      const num = parseInt(parts[parts.length - 1], 10);
      return !isNaN(num) ? Math.max(max, num) : max;
    }, -1);

    const slug = modifier === -1 ? baseSlug : `${baseSlug}-${modifier + 1}`;

    return db.insert(dataset).values({ title, userId, slug }).returning();
  }
}

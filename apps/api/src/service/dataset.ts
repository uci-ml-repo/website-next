import type { z } from "@hono/zod-openapi";
import { db } from "@packages/db";
import { Enums } from "@packages/db/enum";
import { dataset } from "@packages/db/schema";
import { and, arrayContains, arrayOverlaps, asc, eq, gt, inArray, lt } from "drizzle-orm";

import type { datasetsQuerySchema } from "@/schema";

function withUrl(dataset: { id: number; slug: string }) {
  return { ...dataset, url: `https://archive.ics.uci.edu/dataset/${dataset.id}/${dataset.slug}` };
}

async function byId(id: number) {
  const [res] = await db
    .select()
    .from(dataset)
    .where(and(eq(dataset.id, id), eq(dataset.status, Enums.ApprovalStatus.APPROVED)));

  return withUrl(res);
}

async function byQuery(query: z.infer<typeof datasetsQuerySchema>) {
  const conditions = [eq(dataset.status, Enums.ApprovalStatus.APPROVED)];

  if (query.dataTypes?.length) {
    conditions.push(arrayOverlaps(dataset.dataTypes, query.dataTypes));
  }

  if (query.featureTypes?.length) {
    conditions.push(arrayOverlaps(dataset.featureTypes, query.featureTypes));
  }

  if (query.tasks?.length) {
    conditions.push(arrayOverlaps(dataset.tasks, query.tasks));
  }

  if (query.subjectAreas?.length) {
    conditions.push(inArray(dataset.subjectArea, query.subjectAreas));
  }

  if (query.keywords?.length) {
    conditions.push(arrayOverlaps(dataset.keywords, query.keywords));
  }

  if (query.features?.length) {
    conditions.push(arrayContains(dataset.features, query.features));
  }

  if (query.featureCountMin) {
    conditions.push(gt(dataset.featureCount, query.featureCountMin));
  }

  if (query.featureCountMax) {
    conditions.push(lt(dataset.featureCount, query.featureCountMax));
  }

  if (query.instanceCountMin) {
    conditions.push(gt(dataset.instanceCount, query.instanceCountMin));
  }

  if (query.instanceCountMax) {
    conditions.push(lt(dataset.instanceCount, query.instanceCountMax));
  }

  const datasets = await db
    .select()
    .from(dataset)
    .where(and(...conditions))
    .limit(query.take ?? 100)
    .offset(query.skip ?? 0)
    .orderBy(asc(dataset.id));

  return datasets.map(withUrl);
}

export const datasetService = { byId, byQuery };

import "dotenv/config";

import { eq } from "drizzle-orm";
import { reset, seed } from "drizzle-seed";

import { db } from "@/db";
import {
  comment,
  dataset,
  datasetView,
  discussion,
  paper,
  user,
} from "@/db/schema";
import * as schema from "@/db/schema";
import { logger } from "@/lib/logger";
import { service } from "@/server/service";

import {
  datasetsSeed,
  dummyPassword,
  papersSeed,
  usersSeed,
} from "./seed-data";

async function main() {
  await reset(db, schema);

  await db.insert(user).values(usersSeed);
  await db.insert(dataset).values(datasetsSeed);
  await db.insert(paper).values(papersSeed);

  await seed(db, { user }, { count: 100 }).refine((f) => ({
    user: {
      columns: {
        name: f.fullName(),
        password: f.valuesFromArray({ values: [dummyPassword] }),
        image: f.valuesFromArray({
          values: ["https://ics.uci.edu/~smyth/padhraic2_sept2019.jpeg"],
        }),
      },
    },
  }));

  const users = await db.select().from(user);
  const datasets = await db.select().from(dataset);
  const [iris] = await db.select().from(dataset).where(eq(dataset.id, 53));

  await seed(db, { discussion }, { count: 55 }).refine((f) => ({
    discussion: {
      columns: {
        createdAt: f.date({ maxDate: new Date("01-01-2024") }),
        updatedAt: f.date({
          minDate: new Date("01-01-2024"),
          maxDate: new Date(),
        }),
        title: f.loremIpsum(),
        content: f.loremIpsum({ sentencesCount: 50 }),
        userId: f.valuesFromArray({ values: users.map((u) => u.id) }),
        datasetId: f.valuesFromArray({ values: [iris.id] }),
        upvoteCount: f.valuesFromArray({ values: [0] }),
      },
    },
  }));

  const discussions = await db.select().from(discussion);

  await seed(db, { discussionComment: comment }, { count: 1_000 }).refine(
    (f) => ({
      discussionComment: {
        columns: {
          createdAt: f.date({ maxDate: new Date("01-01-2024") }),
          updatedAt: f.date({
            minDate: new Date("01-01-2024"),
            maxDate: new Date(),
          }),
          discussionId: f.valuesFromArray({
            values: discussions.map((d) => d.id),
          }),
          userId: f.valuesFromArray({ values: users.map((u) => u.id) }),
          upvoteCount: f.valuesFromArray({ values: [0] }),
          content: f.loremIpsum({ sentencesCount: 5 }),
        },
      },
    }),
  );

  for (const d of datasets) {
    await service.dataset.update.zipSize(d);
  }

  await db.refreshMaterializedView(datasetView);
}

main().then(() => {
  logger.info("Seeding complete");
  process.exit(0);
});

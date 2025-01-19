import "dotenv/config";

import { db } from "@/db";
import { datasets, papers, users } from "@/db/schema";

import { datasetsSeed, papersSeed, usersSeed } from "./seed-data";

async function seed() {
  await db.transaction(async (tx) => {
    await tx.insert(users).values(usersSeed);
    await tx.insert(datasets).values(datasetsSeed);
    await tx.insert(papers).values(papersSeed);
  });
}

seed().then(() => {
  console.log("Seeding complete");
  process.exit(0);
});

import "dotenv/config";

import { db } from "@/db";
import { dataset, paper, user } from "@/db/schema";

import { datasetsSeed, papersSeed, usersSeed } from "./seed-data";

async function seed() {
  await db.transaction(async (tx) => {
    await tx.insert(user).values(usersSeed);
    await tx.insert(dataset).values(datasetsSeed);
    await tx.insert(paper).values(papersSeed);
  });
}

seed().then(() => {
  console.log("Seeding complete");
  process.exit(0);
});

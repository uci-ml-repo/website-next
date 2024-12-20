import { prisma } from "@/lib/prisma";

import { datasets, introductoryPapers, users } from "./seed-data";

async function seed() {
  prisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: users,
    });
    await Promise.all(
      datasets.map(async (dataset) => {
        await tx.dataset.create({
          data: dataset,
        });
      }),
    );
    await tx.datasetPaper.createMany({
      data: introductoryPapers,
    });
  });
}

seed().then();

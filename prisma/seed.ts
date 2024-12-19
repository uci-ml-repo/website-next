import { prisma } from "@/lib/prisma";

import { datasets, introductoryPapers, users } from "./seed-data";

async function seed() {
  await prisma.$transaction([
    prisma.user.createMany({
      data: users,
    }),
    prisma.datasetPaper.createMany({
      data: introductoryPapers,
    }),
    prisma.dataset.createMany({
      data: datasets,
    }),
  ]);
}

seed().then();

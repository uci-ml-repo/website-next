import { prisma } from "@/lib/prisma";

import { datasets, introductoryPapers, roles, users } from "./seed-data";

async function seed() {
  await prisma.$transaction([
    prisma.role.createMany({
      data: roles,
    }),
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

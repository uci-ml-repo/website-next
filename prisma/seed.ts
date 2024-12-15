import { prisma } from "@/lib/db/prisma";

import { datasets, roles, users } from "./seed-data";

async function seed() {
  await prisma.$transaction([
    prisma.role.createMany({
      data: roles,
    }),
    prisma.user.createMany({
      data: users,
    }),
    prisma.dataset.createMany({
      data: datasets,
    }),
  ]);
}

seed().then();

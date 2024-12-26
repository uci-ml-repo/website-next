import { type PrismaClient } from "@prisma/client";

export default class FileFindService {
  constructor(readonly prisma: PrismaClient) {}
}

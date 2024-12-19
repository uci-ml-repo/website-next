import type { UserRole } from "@prisma/client";

export const PRIVILEGED_ROLES: Set<UserRole> = new Set([
  "ADMIN",
  "CURATOR",
  "LIBRARIAN",
]);

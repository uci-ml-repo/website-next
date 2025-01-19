import { Enums } from "@/db/types";

export const PRIVILEGED_ROLES: Set<Enums.UserRole> = new Set([
  Enums.UserRole.ADMIN,
  Enums.UserRole.LIBRARIAN,
  Enums.UserRole.CURATOR,
]);

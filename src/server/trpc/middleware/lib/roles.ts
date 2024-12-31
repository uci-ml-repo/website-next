import { $Enums, UserRole } from "@prisma/client";

export const MiddlewareRoles = {
  DATASET_OWNER: "DATASET_OWNER",
  DATASET_DRAFT_OWNER: "DATASET_DRAFT_OWNER",
  DISCUSSION_AUTHOR: "DISCUSSION_AUTHOR",
  ...$Enums.UserRole,
} as const;

export type MiddlewareRole =
  (typeof MiddlewareRoles)[keyof typeof MiddlewareRoles];

const PRIVILIGED_ROLES = new Set<UserRole>([
  UserRole.ADMIN,
  UserRole.CURATOR,
  UserRole.LIBRARIAN,
]);

export function isPriviliged(role: UserRole) {
  return PRIVILIGED_ROLES.has(role);
}

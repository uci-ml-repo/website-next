import type { UserRole } from "@/db/enums";
import { Enums } from "@/db/enums";
import { PRIVILEGED_ROLES } from "@/lib/permissions";

export const MiddlewareRoles = {
  DATASET_OWNER: "DATASET_OWNER",
  DISCUSSION_AUTHOR: "DISCUSSION_AUTHOR",
  ...Enums.UserRole,
} as const;

export type MiddlewareRole =
  (typeof MiddlewareRoles)[keyof typeof MiddlewareRoles];

export function isPriviliged(role: UserRole) {
  return PRIVILEGED_ROLES.has(role);
}

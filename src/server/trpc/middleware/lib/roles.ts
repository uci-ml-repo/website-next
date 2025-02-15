import type { UserRole } from "@/db/lib/enums";
import { Enums } from "@/db/lib/enums";
import { PRIVILEGED_ROLES } from "@/lib/roles";

export const MiddlewareRoles = {
  DATASET_OWNER: "DATASET_OWNER",
  DISCUSSION_AUTHOR: "DISCUSSION_AUTHOR",
  COMMENT_AUTHOR: "COMMENT_AUTHOR",
  VERIFIED: "VERIFIED",
  IS_USER_ID: "IS_USER_ID",
  ...Enums.UserRole,
} as const;

export type MiddlewareRole =
  (typeof MiddlewareRoles)[keyof typeof MiddlewareRoles];

export function isPriviliged(role?: UserRole) {
  if (!role) {
    return false;
  }

  return PRIVILEGED_ROLES.has(role);
}

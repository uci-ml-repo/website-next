import type { Session } from "next-auth";

import type { UserRole } from "@/db/lib/enums";
import { Enums } from "@/db/lib/enums";
import type { DatasetResponse } from "@/lib/types";

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

export const PRIVILEGED_ROLES: Enums.UserRole[] = [
  Enums.UserRole.ADMIN,
  Enums.UserRole.LIBRARIAN,
  Enums.UserRole.CURATOR,
];

export const SUPER_PRIVILEGED_ROLES: Enums.UserRole[] = [
  Enums.UserRole.ADMIN,
  Enums.UserRole.LIBRARIAN,
];

/**
 * Returns true if the user has a privileged role.
 *
 * @param role the user role to check
 */
export function isPriviliged(role?: UserRole) {
  if (!role) {
    return false;
  }

  return PRIVILEGED_ROLES.includes(role);
}

/**
 * Returns true if the user has a super privileged role.
 *
 * @param role the user role to check
 */
export function isSuperPriviliged(role?: UserRole) {
  if (!role) {
    return false;
  }

  return SUPER_PRIVILEGED_ROLES.includes(role);
}

/**
 * Returns true if the user has privileges to instantly delete a dataset.
 *
 * @param user the user deleting the dataset
 * @param dataset the dataset to delete
 */
export function canDeleteDataset({
  user,
  dataset,
}: {
  user: Session["user"];
  dataset: DatasetResponse;
}) {
  const isDatasetOwner = user.id === dataset.userId;

  const isDraftOrPending =
    dataset.status === Enums.ApprovalStatus.DRAFT ||
    dataset.status === Enums.ApprovalStatus.PENDING;

  return isSuperPriviliged(user.role) || (isDatasetOwner && isDraftOrPending);
}

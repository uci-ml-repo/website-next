import { $Enums } from "@prisma/client";

export const MiddlewareRoles = {
  DATASET_OWNER: "DATASET_OWNER",
  DATASET_DRAFT_OWNER: "DATASET_DRAFT_OWNER",
  DISCUSSION_AUTHOR: "DISCUSSION_AUTHOR",
  ...$Enums.UserRole,
} as const;

export type MiddlewareRole =
  (typeof MiddlewareRoles)[keyof typeof MiddlewareRoles];

import { Enums } from "@packages/db/enum";

export const PRIVILEGED_ROLES = [
  Enums.UserRole.ADMIN,
  Enums.UserRole.LIBRARIAN,
  Enums.UserRole.CURATOR,
];

/**
 * Returns true if the user has a privileged role.
 *
 * @param role the user role to check
 */
export function isPrivileged(role?: Enums.UserRole) {
  return role && PRIVILEGED_ROLES.includes(role);
}

/**
 * Returns true if the user has the admin role.
 *
 * @param role the user role to check
 */
export function isAdmin(role?: Enums.UserRole) {
  return role === Enums.UserRole.ADMIN;
}

const ROLE_RANK: Record<Enums.UserRole, number> = {
  [Enums.UserRole.BASIC]: 0,
  [Enums.UserRole.CURATOR]: 1,
  [Enums.UserRole.LIBRARIAN]: 2,
  [Enums.UserRole.ADMIN]: 3,
};

/**
 * Returns true if `role` is strictly higher than `currentRole`.
 */
export function isHigherRole(role: Enums.UserRole, currentRole: Enums.UserRole) {
  return ROLE_RANK[role] > ROLE_RANK[currentRole];
}

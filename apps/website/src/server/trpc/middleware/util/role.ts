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
export function isPriviliged(role?: Enums.UserRole) {
  return role && PRIVILEGED_ROLES.includes(role);
}

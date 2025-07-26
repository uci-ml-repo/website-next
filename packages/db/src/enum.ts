export namespace Enums {
  export enum UserRole {
    ADMIN = "admin",
    LIBRARIAN = "librarian",
    CURATOR = "curator",
    BASIC = "basic",
  }
}

export type UserRole = (typeof Enums.UserRole)[keyof typeof Enums.UserRole];

export function enumToArray<T extends Record<string, string>>(
  enumType: T,
): [T[keyof T], ...T[keyof T][]] {
  const values = Object.values(enumType);
  if (values.length === 0) {
    throw new Error("Enum must have at least one value");
  }
  return values as [T[keyof T], ...T[keyof T][]];
}

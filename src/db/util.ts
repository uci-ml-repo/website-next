export function enumToArray<T extends Record<string, string>>(enum_: T) {
  return Object.values(enum_) as [string, ...string[]];
}

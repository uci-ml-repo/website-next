export function toStringArray(str: string | string[]): string[] {
  return Array.isArray(str) ? str : [str];
}

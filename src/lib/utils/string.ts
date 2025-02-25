export function jsonOrString(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function toStringArray(str: string | string[]): string[] {
  return Array.isArray(str) ? str : [str];
}

export function jsonOrString(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

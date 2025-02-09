export function buildQueryFilters(filters: Record<string, unknown>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (typeof value === "object") {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    }
  });

  return params;
}

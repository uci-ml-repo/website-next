export function getPath(url: string) {
  return url.startsWith("http")
    ? new URL(url).pathname + new URL(url).search
    : url;
}

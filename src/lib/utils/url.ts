export function getFullPath(url: string) {
  if (url.startsWith("http")) {
    const urlObject = new URL(url);
    return urlObject.pathname + urlObject.search + urlObject.hash;
  }

  return url;
}

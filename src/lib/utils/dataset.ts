import { STATIC_FILES_ROUTE } from "@/globals";

export function datasetThumbnail({
  hasGraphics,
  id,
}: {
  hasGraphics: boolean;
  id: number;
}) {
  return (
    STATIC_FILES_ROUTE +
    (hasGraphics ? `/${id}` : "/default") +
    "/thumbnail.png"
  );
}

export function datasetHref({ id, slug }: { id: number; slug?: string }) {
  const baseHref = `/datasets/${id}`;
  return slug ? `${baseHref}/${slug}` : baseHref;
}

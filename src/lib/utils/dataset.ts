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

export function datasetPage({ id, slug }: { id: number; slug: string }) {
  return `/datasets/${id}/${slug}`;
}

export function datasetZip({ id, slug }: { id: number; slug: string }) {
  return `${STATIC_FILES_ROUTE}/${id}/${slug}.zip`;
}

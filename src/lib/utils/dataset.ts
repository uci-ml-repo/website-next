import { STATIC_FILES_ROUTE } from "@/lib/routes";

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

export function datasetStaticFiles({ id }: { id: number }) {
  return `${STATIC_FILES_ROUTE}/${id}`;
}

export function datasetStaticFilesAbsolute({ id }: { id: number }) {
  return `${process.env.STATIC_FILES_ROOT}/${id}`;
}

export function datasetPythonData({ id }: { id: number }) {
  return `${datasetStaticFiles({ id })}/data.csv`;
}

export function datasetZip({ id, slug }: { id: number; slug: string }) {
  return `${datasetStaticFiles({ id })}/${slug}.zip`;
}

export function datasetZipAbsolute({ id, slug }: { id: number; slug: string }) {
  return `${datasetStaticFilesAbsolute({ id })}/${slug}.zip`;
}

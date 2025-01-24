import { Enums } from "@/db/enums";
import { DATASETS_PATH, STATIC_FILES_ROUTE } from "@/lib/routes";

/**
 * Get the path for a dataset's data files
 *
 * @param id dataset id
 * @param slug dataset slug
 * @param status dataset approval status
 *
 * @returns the directory path
 *
 * @example `/public/53/iris`
 */
export function datasetFilesPath({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: string;
}) {
  return `/${status === Enums.DatasetStatus.APPROVED ? "public" : "private"}/${id}/${slug}`;
}

export function datasetThumbnailURL({
  status,
  hasGraphics,
  id,
}: {
  status: string;
  hasGraphics: boolean;
  id: number;
}) {
  return (
    (hasGraphics
      ? datasetFilesURL({ id, status })
      : `${STATIC_FILES_ROUTE}/default`) + "/thumbnail.png"
  );
}

export function datasetFilesURL({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return `${STATIC_FILES_ROUTE}/${status === Enums.DatasetStatus.APPROVED ? "public" : "private"}/${id}`;
}

export function datasetPythonDataURL({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return `${datasetFilesURL({ id, status })}/data.csv`;
}

export function datasetZipURL({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: string;
}) {
  return `${datasetFilesURL({ id, status })}/${slug}.zip`;
}

export function datasetPage({ id, slug }: { id: number; slug: string }) {
  return `${DATASETS_PATH}/${id}/${slug}`;
}

import type { ApprovalStatus } from "@prisma/client";

import { STATIC_FILES_ROUTE } from "@/lib/routes";

/**
 * Get the directory for a dataset's data files
 *
 * @param id dataset id
 * @param slug dataset slug
 * @param status dataset approval status
 *
 * @returns the directory path
 *
 * @example `/public/53/iris`
 */
export function datasetFilesDirectory({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: ApprovalStatus;
}) {
  return `/${status === "APPROVED" ? "public" : "private"}/${id}/${slug}`;
}

export function datasetThumbnailURL({
  status,
  hasGraphics,
  id,
}: {
  status: ApprovalStatus;
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
  status: ApprovalStatus;
}) {
  return `${STATIC_FILES_ROUTE}/${status === "APPROVED" ? "public" : "private"}/${id}`;
}

export function datasetPythonDataURL({
  id,
  status,
}: {
  id: number;
  status: ApprovalStatus;
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
  status: ApprovalStatus;
}) {
  return `${datasetFilesURL({ id, status })}/${slug}.zip`;
}

export function datasetPage({ id, slug }: { id: number; slug: string }) {
  return `/datasets/${id}/${slug}`;
}

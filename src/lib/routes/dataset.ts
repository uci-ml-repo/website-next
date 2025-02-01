import { Enums } from "@/db/enums";
import { STATIC_FILES_ROUTE } from "@/lib/routes/index";

export const DATASETS_ROUTE = "/datasets";

export function DATASET_ROUTE({ id, slug }: { id: number; slug: string }) {
  return `${DATASETS_ROUTE}/${id}/${slug}`;
}

export function DATASET_DISCUSSIONS_ROUTE({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  return `${DATASET_ROUTE({ id, slug })}/discussions`;
}

export function DATASET_DISCUSSION_ROUTE({
  id,
  slug,
  discussionId,
}: {
  id: number;
  slug: string;
  discussionId: string;
}) {
  return `${DATASET_DISCUSSIONS_ROUTE({ id, slug })}/${discussionId}`;
}

export function DATASET_DISCUSSION_CREATE_ROUTE({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  return `${DATASET_ROUTE({ id, slug })}/discussions/create`;
}

export function DATASET_DISCUSSION_EDIT_ROUTE({
  id,
  slug,
  discussionId,
}: {
  id: number;
  slug: string;
  discussionId: string;
}) {
  return `${DATASET_DISCUSSION_ROUTE({ id, slug, discussionId })}/edit`;
}

export function DATASET_THUMBNAIL_ROUTE({
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
      ? DATASET_FILES_ROUTE({ id, status })
      : `${STATIC_FILES_ROUTE}/default`) + "/thumbnail.png"
  );
}

export function DATASET_FILES_ROUTE({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return `${STATIC_FILES_ROUTE}/${status === Enums.DatasetStatus.APPROVED ? "public" : "private"}/${id}`;
}

export function DATASET_PYTHON_DATA_ROUTE({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return `${DATASET_FILES_ROUTE({ id, status })}/data.csv`;
}

export function DATASET_ZIP_ROUTE({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: string;
}) {
  return `${DATASET_FILES_ROUTE({ id, status })}/${slug}.zip`;
}

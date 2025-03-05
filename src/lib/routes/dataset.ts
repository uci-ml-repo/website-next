import path from "path";

import { Enums } from "@/db/lib/enums";
import { STATIC_FILES_ROUTE } from "@/lib/routes/index";
import { buildQueryFilters } from "@/lib/utils";
import type { DatasetQuery } from "@/server/schema/dataset";

export const DATASETS_ROUTE = "/datasets";

export const DATASET_BASE_ROUTE = "/dataset";

/**
 * @example "/datasets?search=iris"
 */
export function DATASETS_QUERY(query: DatasetQuery) {
  return DATASETS_ROUTE + "?" + buildQueryFilters(query).toString();
}

/**
 * @example "/dataset/53/iris"
 */
export function DATASET_ROUTE({ id, slug }: { id: number; slug: string }) {
  return path.join(DATASET_BASE_ROUTE, String(id), slug);
}

/**
 * @example "/dataset/53/iris/files"
 */
export function DATASET_FILES_ROUTE({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  return path.join(DATASET_ROUTE({ id, slug }), "files");
}

/**
 * @example "/dataset/53/iris/discussions"
 */
export function DATASET_DISCUSSIONS_ROUTE({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  return path.join(DATASET_ROUTE({ id, slug }), "discussions");
}

/**
 * @example "/dataset/53/iris/discussions/[uuid]"
 */
export function DATASET_DISCUSSION_ROUTE({
  id,
  slug,
  discussionId,
}: {
  id: number;
  slug: string;
  discussionId: string;
}) {
  return path.join(DATASET_DISCUSSIONS_ROUTE({ id, slug }), discussionId);
}

/**
 * @example "/dataset/53/iris/discussions/create"
 */
export function DATASET_DISCUSSION_CREATE_ROUTE({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  return path.join(DATASET_DISCUSSIONS_ROUTE({ id, slug }), "create");
}

/**
 * @example "/dataset/53/iris/discussions/[uuid]/edit"
 */
export function DATASET_DISCUSSION_EDIT_ROUTE({
  id,
  slug,
  discussionId,
}: {
  id: number;
  slug: string;
  discussionId: string;
}) {
  return path.join(
    DATASET_DISCUSSION_ROUTE({ id, slug, discussionId }),
    "edit",
  );
}

/**
 * @example "/dataset/53/iris/settings"
 */
export function DATASET_SETTINGS_ROUTE({
  id,
  slug,
}: {
  id: number;
  slug: string;
}) {
  return path.join(DATASET_ROUTE({ id, slug }), "settings");
}

/**
 * @example "/api/static/public/53"
 */
export function DATASET_API_FILES_ROUTE({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return path.join(STATIC_FILES_ROUTE, DATASET_FILES_PATH({ id, status }));
}

/**
 * @example "/api/static/public/53/thumbnail.png"
 */
export function DATASET_API_THUMBNAIL_ROUTE({
  status,
  hasGraphics,
  id,
}: {
  status: string;
  hasGraphics: boolean;
  id: number;
}) {
  return path.join(
    hasGraphics
      ? DATASET_API_FILES_ROUTE({ id, status })
      : path.join(STATIC_FILES_ROUTE, "public", "default"),
    "thumbnail.png",
  );
}

/**
 * @example "/public/53"
 */
export function DATASET_FILES_PATH({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return path.join(
    "/",
    status === Enums.ApprovalStatus.APPROVED ? "public" : "private",
    String(id),
  );
}

/**
 * @example "/public/53/iris"
 */
export function DATASET_FILES_UNZIPPED_PATH({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: string;
}) {
  return path.join(DATASET_FILES_PATH({ id, status }), slug);
}

/**
 * @example "/public/53/iris.pending"
 */
export function DATASET_FILES_UNZIPPED_PENDING_PATH({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: string;
}) {
  return DATASET_FILES_UNZIPPED_PATH({ id, slug, status }) + ".new";
}

/**
 * @example "/public/53/iris.zip"
 */
export function DATASET_FILES_ZIP_PATH(input: {
  id: number;
  slug: string;
  status: string;
}) {
  return DATASET_FILES_UNZIPPED_PATH(input) + ".zip";
}

/**
 * @example "/public/53/iris.pending.zip"
 */
export function DATASET_FILES_ZIP_PENDING_PATH(input: {
  id: number;
  slug: string;
  status: string;
}) {
  return DATASET_FILES_UNZIPPED_PATH(input) + ".pending.zip";
}

/**
 * @example "/api/static/public/53/data.csv"
 */
export function DATASET_API_PYTHON_DATA_ROUTE({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  return path.join(DATASET_API_FILES_ROUTE({ id, status }), "data.csv");
}

/**
 * @example "/api/static/public/53/iris.zip"
 */
export function DATASET_API_ZIP_ROUTE({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: string;
}) {
  return path.join(DATASET_API_FILES_ROUTE({ id, status }), `${slug}.zip`);
}

/**
 * @example "/api/static/public/53/iris.pending.zip"
 */
export function DATASET_API_ZIP_PENDING_ROUTE({
  id,
  slug,
  status,
}: {
  id: number;
  slug: string;
  status: string;
}) {
  return path.join(
    DATASET_API_FILES_ROUTE({ id, status }),
    `${slug}.pending.zip`,
  );
}

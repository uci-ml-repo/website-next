import * as fs from "node:fs";

import {
  DATASET_FILES_THUMBNAIL_PENDING_PATH,
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_UNZIPPED_PENDING_PATH,
  DATASET_FILES_ZIP_LOCK_PATH,
  DATASET_FILES_ZIP_PATH,
  DATASET_FILES_ZIP_PENDING_LOCK_PATH,
  DATASET_FILES_ZIP_PENDING_PATH,
} from "@/lib/routes";
import { absoluteStaticPath } from "@/lib/utils/file";

export type DatasetFileStatus =
  | null
  | "awaiting-upload"
  | "unzipping"
  | "unzipped"
  | "not-unzipped";

/**
 * | zip | lock | unzip |                 |
 * |-----|------|-------| --------------- |
 * | X   | X    | X     | -               |
 * | X   | X    | -     | unzipping       |
 * | X   | -    | X     | unzipped        |
 * | X   | -    | -     | not-unzipped    |
 * | -   | X    | X     | -               |
 * | -   | X    | -     | -               |
 * | -   | -    | X     | -               |
 * | -   | -    | -     | awaiting-upload |
 */
export namespace datasetFileService {
  export async function fileStatuses(dataset: {
    id: number;
    slug: string;
    status: string;
    externalLink: string | null;
  }) {
    const hasPendingThumbnail = fs.existsSync(
      absoluteStaticPath(DATASET_FILES_THUMBNAIL_PENDING_PATH(dataset)),
    );

    if (dataset.externalLink) {
      return {
        status: null,
        pendingStatus: null,
        hasPendingThumbnail,
      };
    }

    const zipExists = fs.existsSync(absoluteStaticPath(DATASET_FILES_ZIP_PATH(dataset)));
    const zipLockExists = fs.existsSync(absoluteStaticPath(DATASET_FILES_ZIP_LOCK_PATH(dataset)));
    const unzippedExists = fs.existsSync(absoluteStaticPath(DATASET_FILES_UNZIPPED_PATH(dataset)));
    const pendingZipExists = fs.existsSync(
      absoluteStaticPath(DATASET_FILES_ZIP_PENDING_PATH(dataset)),
    );
    const pendingLockExists = fs.existsSync(
      absoluteStaticPath(DATASET_FILES_ZIP_PENDING_LOCK_PATH(dataset)),
    );
    const pendingUnzippedExists = fs.existsSync(
      absoluteStaticPath(DATASET_FILES_UNZIPPED_PENDING_PATH(dataset)),
    );

    const status: DatasetFileStatus = zipExists
      ? zipLockExists
        ? "unzipping"
        : unzippedExists
          ? "unzipped"
          : "not-unzipped"
      : "awaiting-upload";

    const pendingStatus: DatasetFileStatus = pendingZipExists
      ? pendingLockExists
        ? "unzipping"
        : pendingUnzippedExists
          ? "unzipped"
          : "not-unzipped"
      : "awaiting-upload";

    return { status, pendingStatus, hasPendingThumbnail };
  }
}

import { Enums } from "@/db/lib/enums";

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
  return `/${status === Enums.ApprovalStatus.APPROVED ? "public" : "private"}/${id}/${slug}`;
}

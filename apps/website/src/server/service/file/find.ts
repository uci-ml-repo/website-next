import { ListObjectsV2Command, type ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { Resource } from "sst";

import { s3 } from "@/server/service/file/index";

export type FileEntry = {
  key: string;
  size?: number;
  lastModified?: Date;
  kind: "file";
  basename: string;
};

export type DirectoryEntry = {
  key: string;
  kind: "directory";
  basename: string;
};

export type Entry = FileEntry | DirectoryEntry;

function stripPrefix(fullKey: string, prefix: string) {
  return fullKey.startsWith(prefix) ? fullKey.slice(prefix.length) : fullKey;
}

async function list({ id, slug }: { id: number; slug: string }): Promise<Entry[] | undefined> {
  const rootPrefix = `${id}/${slug}/`;

  const entries: Entry[] = [];
  const seenDirs = new Set<string>();
  const toVisit: string[] = [rootPrefix];

  while (toVisit.length > 0) {
    const currentPrefix = toVisit.shift();
    let continuationToken: string | undefined = undefined;

    do {
      const out: ListObjectsV2CommandOutput = await s3.send(
        new ListObjectsV2Command({
          Bucket: Resource.Bucket.name,
          Prefix: currentPrefix,
          Delimiter: "/",
          ContinuationToken: continuationToken,
        }),
      );

      if (out.CommonPrefixes) {
        for (const commonPrefix of out.CommonPrefixes) {
          if (!commonPrefix.Prefix) continue;
          const relativeDir = stripPrefix(commonPrefix.Prefix, rootPrefix).replace(/\/$/, "");
          if (relativeDir.length > 0 && !seenDirs.has(relativeDir)) {
            entries.push({
              key: relativeDir,
              kind: "directory",
              basename: relativeDir.split("/").pop() || relativeDir,
            });
            seenDirs.add(relativeDir);
          }
          toVisit.push(commonPrefix.Prefix);
        }
      }

      if (out.Contents) {
        for (const obj of out.Contents) {
          if (!obj.Key || obj.Key === currentPrefix) continue;
          const relative = stripPrefix(obj.Key, rootPrefix);
          if (!relative.length) continue;

          entries.push({
            key: relative,
            size: obj.Size,
            lastModified: obj.LastModified,
            kind: "file",
            basename: relative.split("/").pop() || relative,
          });
        }
      }

      continuationToken = out.IsTruncated ? out.NextContinuationToken : undefined;
    } while (continuationToken && continuationToken.length > 0);
  }

  return entries.length > 0 ? entries : undefined;
}

export const fileFindService = {
  list,
};

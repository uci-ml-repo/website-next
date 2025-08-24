import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Resource } from "sst";

import { s3 } from ".";

async function readBytes({
  key,
  skipBytes,
  takeBytes,
}: {
  key: string;
  skipBytes: number;
  takeBytes: number;
}) {
  const endByte = skipBytes + takeBytes - 1;

  const out = await s3.send(
    new GetObjectCommand({
      Bucket: Resource.Bucket.name,
      Key: key,
      Range: `bytes=${skipBytes}-${endByte}`,
    }),
  );

  const chunks: Buffer[] = [];
  for await (const chunk of out.Body as AsyncIterable<Uint8Array | Buffer | string>) {
    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
    } else if (chunk instanceof Uint8Array) {
      chunks.push(Buffer.from(chunk));
    } else {
      chunks.push(Buffer.from(String(chunk)));
    }
  }

  const text = Buffer.concat(chunks).toString("utf-8");

  let nextCursor: number | undefined;
  if (out.ContentRange) {
    const [, range] = out.ContentRange.split("/");
    const total = parseInt(range, 10);

    const newCursor = skipBytes + Buffer.byteLength(text);
    if (newCursor < total) {
      nextCursor = newCursor;
    }
  }

  return { text, nextCursor };
}

export const fileReadService = { readBytes };

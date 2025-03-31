import { eq } from "drizzle-orm";
import fs from "fs-extra";
import mime from "mime";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import path from "path";

import { auth } from "@/auth";
import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { dataset } from "@/db/schema";
import { env } from "@/env";
import {
  DATASET_FILES_THUMBNAIL_PATH,
  DATASET_FILES_THUMBNAIL_PENDING_PATH,
  DATASET_FILES_ZIP_PATH,
  DATASET_FILES_ZIP_PENDING_PATH,
} from "@/lib/routes";
import { toStringArray } from "@/lib/utils";
import { absoluteStaticPath } from "@/lib/utils/file";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return auth(async (req, { params }) => {
    try {
      if (!env.STATIC_FILES_DIRECTORY) {
        return NextResponse.json({ error: "Storage path is not defined" }, { status: 500 });
      }

      if (!params) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
      }

      const relativePath = toStringArray((await params).path);
      const filePath = absoluteStaticPath(relativePath);

      if (!(await fs.pathExists(filePath))) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      if (relativePath[0] === "private") {
        if (!req.auth) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!isPriviliged(req.auth.user.role)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      const fileContent = await fs.readFile(filePath);
      const contentType = mime.getType(filePath) || "application/octet-stream";

      const fileSize = fs.statSync(filePath).size;

      return new NextResponse(fileContent, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": fileSize.toString(),
          "Accept-Ranges": "bytes",
          "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
        },
      });
    } catch (error: unknown) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  })(req, {
    params: { path: (await ctx.params).path },
  });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return auth(async (req, { params }) => {
    try {
      if (!params) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
      }

      const relativePath = "/" + toStringArray((await params).path).join("/");
      const filePath = absoluteStaticPath(relativePath);
      const directoryPath = path.dirname(filePath);

      if (!(await fs.pathExists(directoryPath))) {
        return NextResponse.json({ error: "Upload directory not found" }, { status: 404 });
      }

      if (!req.auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const datasetRegex = RegExp(
        String.raw`^${env.STATIC_FILES_DIRECTORY}\/(private|public)\/(?<datasetId>\d+)`,
      );
      const isDatasetPath = datasetRegex.test(filePath);

      const datasetId = Number(datasetRegex.exec(filePath)?.groups?.datasetId);

      if (!isDatasetPath || isNaN(datasetId)) {
        return NextResponse.json(
          {
            error: "Invalid upload path for dataset",
          },
          { status: 400 },
        );
      }

      const [uploadToDataset] = await db.select().from(dataset).where(eq(dataset.id, datasetId));

      if (!uploadToDataset) {
        return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
      }

      if (
        relativePath !== DATASET_FILES_ZIP_PENDING_PATH(uploadToDataset) &&
        relativePath !== DATASET_FILES_ZIP_PATH(uploadToDataset) &&
        relativePath !== DATASET_FILES_THUMBNAIL_PATH(uploadToDataset) &&
        relativePath !== DATASET_FILES_THUMBNAIL_PENDING_PATH(uploadToDataset)
      ) {
        return NextResponse.json({ error: "Invalid upload path for dataset" }, { status: 400 });
      }

      if (
        relativePath === DATASET_FILES_ZIP_PATH(uploadToDataset) &&
        uploadToDataset.status !== Enums.ApprovalStatus.DRAFT
      ) {
        return NextResponse.json(
          { error: "Invalid upload path for non-draft dataset" },
          { status: 403 },
        );
      }

      if (!isPriviliged(req.auth.user.role) && req.auth.user.id !== uploadToDataset.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const formData = await req.formData();

      const file = formData.get("file") as Blob | null;
      if (!file) {
        return NextResponse.json({ error: "File blob is required." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({ path: filePath });
    } catch (error: unknown) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  })(req, {
    params: { path: (await ctx.params).path },
  });
}

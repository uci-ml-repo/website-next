import fs from "fs-extra";
import mime from "mime";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import path from "path";

import { auth } from "@/auth";
import { PRIVILEGED_ROLES } from "@/lib/utils/permissions";
import { toStringArray } from "@/lib/utils/string";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return auth(async (req, { params }) => {
    try {
      if (!process.env.STATIC_FILES_ROOT) {
        return NextResponse.json(
          { error: "Storage root is not defined" },
          { status: 500 },
        );
      }

      if (!params) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
      }

      const relativePath = toStringArray((await params).path);
      const filePath = path.join(
        process.env.STATIC_FILES_ROOT,
        ...relativePath,
      );

      if (!(await fs.pathExists(filePath))) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      // Check if the file is protected
      if (relativePath.some((part) => part.startsWith("_"))) {
        if (!req.auth) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!PRIVILEGED_ROLES.has(req.auth.user.role)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      const fileContent = await fs.readFile(filePath);
      const contentType = mime.getType(filePath) || "application/octet-stream";

      return new NextResponse(fileContent, {
        headers: {
          "Content-Type": contentType,
        },
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  })(req, {
    params: { path: (await ctx.params).path },
  });
}

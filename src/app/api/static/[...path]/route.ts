import fs from "fs/promises";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  if (!process.env.STATIC_FILES_ROOT) {
    return NextResponse.json(
      { error: "Storage root is not defined" },
      { status: 500 },
    );
  }

  const filePath = path.join(
    process.env.STATIC_FILES_ROOT,
    ...req.nextUrl.searchParams.getAll("path"),
  );

  try {
    const fileStat = await fs.stat(filePath);

    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileContent = await fs.readFile(filePath);

    return new NextResponse(fileContent);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import fs from "fs/promises";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (!process.env.STATIC_FILES_ROOT) {
    return NextResponse.json(
      { error: "Storage root is not defined" },
      { status: 500 },
    );
  }

  const filePath = path.join(
    process.env.STATIC_FILES_ROOT,
    ...(await params).path,
  );

  try {
    console.log(filePath);

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

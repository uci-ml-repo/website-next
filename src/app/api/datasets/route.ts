import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // TODO
  console.log(req);
  return NextResponse.json({});
}

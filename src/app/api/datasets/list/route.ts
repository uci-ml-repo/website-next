import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { caller } from "@/server/trpc/query/server";

export async function GET(_req: NextRequest) {
  const datasets = (await caller.datasets.find.byQuery({})).datasets;

  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: datasets.map((dataset) => ({
      id: dataset.id,
      name: dataset.title,
    })),
  });
}

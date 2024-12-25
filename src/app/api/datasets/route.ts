import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { datasetToPythonMetadata } from "@/app/api/datasets/schema";
import type { DatasetResponse } from "@/lib/types";
import { caller } from "@/server/trpc/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const name = req.nextUrl.searchParams.get("name");

  if (id && name) {
    return NextResponse.json({
      status: 400,
      message: "Provide only one of 'id' or 'name'",
    });
  }

  let dataset: DatasetResponse | null;

  if (id) {
    const idNumber = parseInt(id);

    if (isNaN(idNumber)) {
      return NextResponse.json({
        status: 400,
        message: "Dataset 'id' must be an integer",
      });
    }

    dataset = await caller.dataset.find.byId(idNumber);

    if (!dataset || dataset.status !== "APPROVED") {
      return NextResponse.json({
        status: 404,
        message: `Dataset with id ${id} not found`,
      });
    }
  } else if (name) {
    dataset = await caller.dataset.find.byTitle(name);

    if (!dataset) {
      return NextResponse.json({
        status: 404,
        message: `Dataset with 'name' ${name} not found`,
      });
    }
  } else {
    return NextResponse.json({
      status: 400,
      message: "Provide one of 'id' or 'name'",
    });
  }

  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: datasetToPythonMetadata(dataset),
  });
}

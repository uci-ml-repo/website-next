import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { Enums } from "@/db/enums";
import type {
  AcceptedDatasetResponse,
  DatasetPreviewResponse,
} from "@/lib/types";
import { caller } from "@/server/trpc/query/server";

import { datasetToPythonMetadata } from "./schema";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const name = req.nextUrl.searchParams.get("name");

  if (id && name) {
    return NextResponse.json({
      status: 400,
      message: "Provide only one of 'id' or 'name'",
    });
  }

  let dataset: DatasetPreviewResponse | undefined;

  if (id) {
    const idNumber = parseInt(id);

    if (isNaN(idNumber)) {
      return NextResponse.json({
        status: 400,
        message: "Dataset 'id' must be an integer",
      });
    }

    dataset = await caller.dataset.find.approvedById(idNumber);

    if (!dataset || dataset.status !== Enums.ApprovalStatus.APPROVED) {
      return NextResponse.json({
        status: 404,
        message: `Dataset with id ${id} not found`,
      });
    }
  } else if (name) {
    const datasetByTitle = await caller.dataset.find.byQuery({ search: name });

    if (!datasetByTitle) {
      return NextResponse.json({
        status: 404,
        message: `Dataset with 'name' ${name} not found`,
      });
    }

    dataset = datasetByTitle.datasets[0];
  } else {
    return NextResponse.json({
      status: 400,
      message: "Provide one of 'id' or 'name'",
    });
  }

  return NextResponse.json({
    status: 200,
    statusText: "OK",
    data: datasetToPythonMetadata(dataset as AcceptedDatasetResponse),
  });
}

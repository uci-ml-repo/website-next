import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { defaultHook } from "@/hooks";
import {
  datasetByIdPathSchema,
  datasetByIdResponseSchema,
  datasetQueryResponseSchema,
  datasetsQuerySchema,
  errorSchema,
  responseSchema,
} from "@/schema";

import { service } from "../service";

const datasetRouter = new OpenAPIHono({ defaultHook });

const datasetsQueryRoute = createRoute({
  summary: "Query Datasets",
  operationId: "datasetsQuery",
  tags: ["Datasets"],
  method: "get",
  path: "/",
  request: { query: datasetsQuerySchema },
  description: "Search for datasets matching given filters.",
  responses: {
    200: {
      content: { "application/json": { schema: responseSchema(datasetQueryResponseSchema) } },
      description: "Successful operation",
    },
    422: {
      content: { "application/json": { schema: errorSchema } },
      description: "Invalid parameters",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Internal server error",
    },
  },
});

const datasetByIdRoute = createRoute({
  summary: "Dataset by ID",
  operationId: "datasetById",
  tags: ["Datasets"],
  method: "get",
  path: "/{id}",
  request: { params: datasetByIdPathSchema },
  description: "Retrieve a dataset by its ID.",
  responses: {
    200: {
      content: { "application/json": { schema: responseSchema(datasetByIdResponseSchema) } },
      description: "Successful operation",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Dataset not found",
    },
    422: {
      content: { "application/json": { schema: errorSchema } },
      description: "Invalid parameters",
    },
    500: {
      content: { "application/json": { schema: errorSchema } },
      description: "Internal server error",
    },
  },
});

datasetRouter.openapi(datasetsQueryRoute, async (ctx) => {
  const query = ctx.req.valid("query");

  const datasets = await service.dataset.byQuery(query);

  return ctx.json({ ok: true, data: datasetQueryResponseSchema.parse(datasets) }, 200);
});

datasetRouter.openapi(datasetByIdRoute, async (ctx) => {
  const id = Number(ctx.req.param("id"));

  if (!Number.isInteger(id)) {
    return ctx.json({ ok: false, message: "Parameter 'id' must be an integer" }, 422);
  }

  const dataset = await service.dataset.byId(id);

  return dataset
    ? ctx.json({ ok: true, data: datasetByIdResponseSchema.parse(dataset) }, 200)
    : ctx.json({ ok: false, message: "Dataset not found" }, 404);
});

export { datasetRouter };

import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { handle } from "hono/aws-lambda";
import { Resource } from "sst";

import { openapiMeta } from "@/middleware";
import { router } from "@/router";
import type { ErrorSchema } from "@/schema";

const app = new OpenAPIHono();

// Reference
app.doc("/openapi.json", openapiMeta);
app.use(
  "/",
  Scalar({
    url: "/openapi.json",
    favicon: `${Resource.Website.url}/favicon.ico`,
    pageTitle: "API Reference - UCI Machine Learning Repository",
  }),
);

// Default handlers
app.onError((err, ctx) =>
  ctx.json<ErrorSchema>({ ok: false, message: err.message.replaceAll(/"/g, "'") }, { status: 500 }),
);

app.notFound((ctx) =>
  ctx.json<ErrorSchema>({ ok: false, message: "The requested resource could not be found." }, 404),
);

// API routes
app.route("/v1", router);

export const handler = handle(app);

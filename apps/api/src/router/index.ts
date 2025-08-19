import { OpenAPIHono } from "@hono/zod-openapi";

import { defaultHook } from "@/hooks";

import { datasetRouter } from "./dataset";

const router = new OpenAPIHono({ defaultHook });

router.route("/dataset", datasetRouter);

export { router };

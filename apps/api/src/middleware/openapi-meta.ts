import type { OpenAPIObjectConfigure } from "@hono/zod-openapi";

export const openapiMeta: OpenAPIObjectConfigure<{}, string> = {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "UCI Machine Learning Repository API",
    description: "The API for dataset information from the UCI Machine Learning Repository.",
    contact: { email: "ml-repository@ics.uci.edu" },
  },
  tags: [
    {
      name: "Datasets",
      description: "Dataset information, such as descriptions, metadata, and attributes.",
    },
  ],
};

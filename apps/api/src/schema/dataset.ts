import { z } from "@hono/zod-openapi";
import { Enums, enumToArray } from "@packages/db/enum";

import { stringArrayOf } from "./util/array";

export const datasetByIdPathSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
    example: "53",
    description: "The ID of the dataset",
  }),
});

export const datasetByIdResponseSchema = z.object({
  id: z.int().openapi({ example: 53, description: "The ID of the dataset" }),
  title: z.string().openapi({ example: "Iris", description: "The title of the dataset" }),
  url: z.url().openapi({
    example: "https://archive.ics.uci.edu/dataset/53/iris",
    description: "The URL of the dataset on the UCI Machine Learning Repository website",
  }),
  doi: z.string().openapi({
    example: "10.24432/C56C76",
    description: "The DOI of the dataset, if available",
  }),
  yearCreated: z.int().openapi({ example: 1988, description: "The year the dataset was created" }),
  description: z.string().openapi({
    example: "Iris is one of the earliest datasets used in machine learning. ",
    description: "A description of the dataset",
  }),
  subjectArea: z.enum(Enums.DatasetSubjectArea).openapi({
    example: Enums.DatasetSubjectArea.BIOLOGY,
    description: "The subject area of the dataset",
  }),
  instanceCount: z.int().openapi({
    example: 150,
    description: "The number of instances (data points) in the dataset",
  }),
  featureCount: z.int().nullable().openapi({
    example: 4,
    description:
      "The number of features (attributes) in the dataset, null if the dataset does not have enumerable features",
  }),
  externalLink: z.url().nullable().openapi({
    example: null,
    description:
      "The external reference for this dataset, null if the dataset is hosted directly on the UCI Machine Learning Repository website",
  }),
  dataTypes: z
    .enum(Enums.DatasetDataType)
    .array()
    .openapi({
      example: [Enums.DatasetDataType.TABULAR],
      description: "The data types present in the dataset",
    }),
  tasks: z
    .enum(Enums.DatasetTask)
    .array()
    .openapi({
      example: [Enums.DatasetTask.CLASSIFICATION],
      description: "The tasks that this dataset is suitable for",
    }),
  featureTypes: z
    .enum(Enums.DatasetFeatureType)
    .array()
    .openapi({
      example: [Enums.DatasetFeatureType.CONTINUOUS],
      description: "The types of features in this dataset",
    }),
  keywords: z
    .string()
    .array()
    .openapi({
      example: ["ecology"],
      description: "Keywords associated with the dataset",
    }),
  features: z
    .object({
      name: z.string().openapi({ example: "sepal length", description: "The name of the feature" }),
      role: z.enum(Enums.DatasetFeatureRole),
      type: z.enum(Enums.DatasetFeatureType),
      missingValues: z.boolean().openapi({
        example: false,
        description: "Whether the feature has missing values",
      }),
      description: z.string().nullable().openapi({
        example: "The length of the sepal in centimeters",
        description: "A description of the feature",
      }),
      units: z.string().nullable().openapi({
        example: "cm",
        description: "The units of the feature, if applicable",
      }),
    })
    .array(),
  authors: z
    .object({
      firstName: z.string().openapi({
        example: "Ronald Aylmer",
        description: "The fist name of the author, may be abbreviated",
      }),
      lastName: z.string().openapi({
        example: "Fisher",
        description: "The last name of the author",
      }),
      institution: z.string().nullable().openapi({
        example: "University College, London",
        description: "The institution of the author",
      }),
    })
    .array(),
  paper: z
    .object({
      title: z.string().openapi({
        example: "The Iris data set: In search of the source of virginica",
        description: "The title of the paper",
      }),
      authors: z
        .string()
        .array()
        .openapi({ example: ["A. Unwin", "K. Kleinman"], description: "The authors of the paper" }),
      venue: z
        .string()
        .openapi({ example: "Significance", description: "The venue the paper was published in" }),
      year: z.int().openapi({ example: 2021, description: "The year the paper was published" }),
      url: z.string().openapi({
        example: "https://www.semanticscholar.org/paper/4599862ea877863669a6a8e63a3c707a787d5d7e",
        description: "The external URL that directs to the paper",
      }),
    })
    .nullable(),
  fileCount: z.int().nullable().openapi({
    example: 4,
    description: "The number of files in the dataset, or null if the dataset is external",
  }),
  size: z.int().nullable().openapi({
    example: 3738,
    description: "The size of the zipped dataset in bytes, or null if the dataset is external",
  }),
});

export const datasetsQuerySchema = z.object({
  subjectAreas: stringArrayOf(z.enum(Enums.DatasetSubjectArea))
    .optional()
    .openapi({
      example: [Enums.DatasetSubjectArea.BIOLOGY, Enums.DatasetSubjectArea.OTHER].join(","),
      description: "Include datasets with any of the given subject areas, comma-separated",
      enum: enumToArray(Enums.DatasetSubjectArea),
    }),
  dataTypes: stringArrayOf(z.enum(Enums.DatasetDataType))
    .optional()
    .openapi({
      example: [Enums.DatasetDataType.TABULAR, Enums.DatasetDataType.MULTIVARIATE].join(","),
      description: "Include datasets with any of the given data types, comma-separated",
      enum: enumToArray(Enums.DatasetDataType),
    }),
  featureTypes: stringArrayOf(z.enum(Enums.DatasetFeatureType))
    .optional()
    .openapi({
      example: [Enums.DatasetFeatureType.CATEGORICAL, Enums.DatasetFeatureType.TEXT].join(","),
      description: "Include datasets with any of the given feature types, comma-separated",
      enum: enumToArray(Enums.DatasetFeatureType),
    }),
  tasks: stringArrayOf(z.enum(Enums.DatasetTask))
    .optional()
    .openapi({
      example: [Enums.DatasetTask.CLASSIFICATION, Enums.DatasetTask.REGRESSION].join(","),
      description: "The tasks that datasets should be suitable for, comma-separated",
      enum: enumToArray(Enums.DatasetTask),
    }),
  keywords: stringArrayOf(z.string()).optional().openapi({
    example: "health,genetics",
    description: "Include datasets with any of the given keywords, comma-separated",
  }),
  features: stringArrayOf(z.string()).optional().openapi({
    example: "length,width",
    description: "Include datasets containing all of the given features, comma-separated",
  }),
  featureCountMin: z.int().min(0).optional().openapi({
    example: 100,
    description: "The minimum number of features",
  }),
  featureCountMax: z.int().min(0).optional().openapi({
    example: 1_000,
    description: "The maximum number of features",
  }),
  instanceCountMin: z.int().min(0).optional().openapi({
    example: 100,
    description: "The minimum number of instances",
  }),
  instanceCountMax: z.int().min(0).optional().openapi({
    example: 1_000,
    description: "The maximum number of instances",
  }),
  take: z.coerce
    .number()
    .int()
    .min(0)
    .max(100)
    .default(100)
    .optional()
    .openapi({ example: 100, description: "The maximum number of datasets to return" }),
  skip: z.coerce
    .number()
    .int()
    .min(0)
    .default(0)
    .optional()
    .openapi({ example: 0, description: "The number of datasets to skip" }),
});

export const datasetQueryResponseSchema = datasetByIdResponseSchema
  .omit({ description: true, features: true, keywords: true, authors: true, paper: true })
  .extend({
    features: z
      .string()
      .array()
      .openapi({
        example: ["class", "petal length", "petal width", "sepal length", "sepal width"],
        description: "The feature names in the dataset",
      }),
  })
  .array();

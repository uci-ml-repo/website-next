import { Enums } from "@/db/lib/enums";
import { DATASET_PYTHON_DATA_ROUTE, DATASET_ROUTE } from "@/lib/routes";
import type { AcceptedDatasetResponse } from "@/lib/types";

export type IntroPaperMetadata = {
  title: string;
  authors: string;
  year: number;
  URL: string;
};

export type VariablesMetadata = {
  name: string;
  role: string | null;
  type: string | null;
  description: string | null;
  units: string | null;
  missing_values: string;
};

export type PythonMetadata = {
  uci_id: number;
  name: string;
  repository_url: string;
  data_url: string | null; // will be null if not available for python

  abstract: string;
  area: string;
  tasks: string[];
  characteristics: Enums.DatasetDataType[];

  num_instances: number;
  num_features: number | null;
  feature_types: string[];
  target_col: string[] | null;
  index_col: string[] | null;
  has_missing_values: string | null;

  year_of_dataset_creation: number | null;
  last_updated: string | null;
  dataset_doi: string | null;
  creators: string[] | null;
  intro_paper: IntroPaperMetadata | null;

  variables: VariablesMetadata[] | null;

  external_url?: string | null;
};

// function paperUrl({ semanticScholarId }: { semanticScholarId: number }) {
//   return `https://api.semanticscholar.org/CorpusID:${semanticScholarId}`;
// }

function paperUrl({ url }: { url: string }) {
  return url;
}

export function datasetToPythonMetadata(
  dataset: AcceptedDatasetResponse,
): PythonMetadata {
  return {
    uci_id: dataset.id,
    name: dataset.title,
    repository_url: process.env.ORIGIN + DATASET_ROUTE(dataset),
    data_url: process.env.ORIGIN + DATASET_PYTHON_DATA_ROUTE(dataset),
    abstract: dataset.description,
    area: dataset.subjectArea,
    tasks: dataset.tasks,
    characteristics: dataset.dataTypes,
    num_instances: dataset.instanceCount,
    num_features: dataset.featureCount,
    feature_types: dataset.featureTypes,
    target_col: dataset.variables
      .filter((v) => v.role === Enums.DatasetFeatureRole.TARGET)
      .map((v) => v.name),
    index_col: dataset.variables
      .filter((v) => v.role === Enums.DatasetFeatureRole.ID)
      .map((v) => v.name),
    has_missing_values: dataset.variables.some((v) => v.missingValues)
      ? "yes"
      : "no",
    year_of_dataset_creation: dataset.yearCreated,
    last_updated: dataset.donatedAt.toString(), // TODO: use edits to infer
    dataset_doi: dataset.doi,
    creators: dataset.authors.map(
      (author) => `${author.firstName} ${author.lastName}`,
    ),
    intro_paper: dataset.introductoryPaper && {
      title: dataset.introductoryPaper.title,
      authors: dataset.introductoryPaper.authors.join(", "),
      year: dataset.introductoryPaper.year,
      URL: paperUrl(dataset.introductoryPaper),
    },
    variables: dataset.variables.map((v) => ({
      name: v.name,
      role: v.role,
      type: v.type,
      description: v.description,
      units: v.units,
      missing_values: v.missingValues ? "yes" : "no",
    })),
  };
}

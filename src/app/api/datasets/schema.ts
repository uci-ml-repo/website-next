import type { DatasetResponse } from "@/lib/types";
import { datasetPage, datasetPythonDataURL, paperUrl } from "@/lib/utils";

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
  characteristics: string[];

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

export function datasetToPythonMetadata(
  dataset: DatasetResponse,
): PythonMetadata {
  return {
    uci_id: dataset.id,
    name: dataset.title,
    repository_url: process.env.BASE_URL + datasetPage(dataset),
    data_url: process.env.BASE_URL + datasetPythonDataURL(dataset),
    abstract: dataset.description,
    area: dataset.subjectArea,
    tasks: dataset.tasks,
    characteristics: dataset.characteristics,
    num_instances: dataset.instanceCount,
    num_features: dataset.featureCount,
    feature_types: dataset.featureTypes,
    target_col: dataset.variables
      .filter((v) => v.role === "TARGET")
      .map((v) => v.name),
    index_col: dataset.variables
      .filter((v) => v.role === "ID")
      .map((v) => v.name),
    has_missing_values: dataset.variables.some((v) => v.missingValues)
      ? "yes"
      : "no",
    year_of_dataset_creation: dataset.yearCreated,
    last_updated: dataset.updatedAt.toString(),
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

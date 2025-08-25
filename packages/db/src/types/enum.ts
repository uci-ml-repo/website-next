export namespace Enums {
  export enum UserRole {
    ADMIN = "admin",
    LIBRARIAN = "librarian",
    CURATOR = "curator",
    BASIC = "basic",
  }

  export enum ApprovalStatus {
    DRAFT = "draft",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
  }

  export enum DatasetSubjectArea {
    BIOLOGY = "biology",
    BUSINESS = "business",
    CLIMATE_AND_ENVIRONMENT = "climate_and_environment",
    COMPUTER_SCIENCE = "computer_science",
    EDUCATION = "education",
    ENGINEERING = "engineering",
    GAMES = "games",
    HEALTH_AND_MEDICINE = "health_and_medicine",
    LAW = "law",
    PHYSICS_AND_CHEMISTRY = "physics_and_chemistry",
    SOCIAL_SCIENCE = "social_science",
    OTHER = "other",
  }

  export enum DatasetTask {
    CLASSIFICATION = "classification",
    REGRESSION = "regression",
    CLUSTERING = "clustering",
  }

  export enum DatasetDataType {
    TABULAR = "tabular",
    SEQUENTIAL = "sequential",
    MULTIVARIATE = "multivariate",
    TIME_SERIES = "time_series",
    TEXT = "text",
    IMAGE = "image",
    SPATIOTEMPORAL = "spatiotemporal",
  }

  export enum DatasetFeatureType {
    CATEGORICAL = "categorical",
    INTEGER = "integer",
    CONTINUOUS = "continuous",
    BINARY = "binary",
    TEXT = "text",
    DATE = "date",
    OTHER = "other",
  }

  export enum DatasetFeatureRole {
    ID = "id",
    FEATURE = "feature",
    TARGET = "target",
    OTHER = "other",
  }
}

export type UserRole = (typeof Enums.UserRole)[keyof typeof Enums.UserRole];

export function enumToArray<T extends Record<string, string>>(
  enumType: T,
): [T[keyof T], ...T[keyof T][]] {
  const values = Object.values(enumType);
  if (values.length === 0) {
    throw new Error("Enum must have at least one value");
  }
  return values as [T[keyof T], ...T[keyof T][]];
}

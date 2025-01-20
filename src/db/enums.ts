export namespace Enums {
  export enum UserRole {
    ADMIN = "admin",
    LIBRARIAN = "librarian",
    CURATOR = "curator",
    BASIC = "basic",
  }

  export enum DatasetStatus {
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

  export enum DatasetCharacteristic {
    TABULAR = "tabular",
    SEQUENTIAL = "sequential",
    MULTIVARIATE = "multivariate",
    TIME_SERIES = "time_series",
    TEXT = "text",
    IMAGE = "image",
    SPATIOTEMPORAL = "spatiotemporal",
  }

  export enum DatasetFeatureRole {
    ID = "id",
    FEATURE = "feature",
    TARGET = "target",
    OTHER = "other",
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

  export enum DatasetReportReason {
    MISSING_FILES_OR_DATA = "missing_files_or_data",
    INACCURATE_METADATA = "inaccurate_metadata",
    OTHER = "other",
  }

  export enum DiscussionReportReason {
    SPAM = "spam",
    UNPROFESSIONAL = "unprofessional",
    INAPPROPRIATE = "inappropriate",
    OTHER = "other",
  }

  export enum ReportResolutionType {
    IGNORED = "ignored",
    RESOLVED = "resolved",
  }
}

export type UserRole = (typeof Enums.UserRole)[keyof typeof Enums.UserRole];

export type DatasetStatus =
  (typeof Enums.DatasetStatus)[keyof typeof Enums.DatasetStatus];

export type DatasetSubjectArea =
  (typeof Enums.DatasetSubjectArea)[keyof typeof Enums.DatasetSubjectArea];

export type DatasetTask =
  (typeof Enums.DatasetTask)[keyof typeof Enums.DatasetTask];

export type DatasetCharacteristic =
  (typeof Enums.DatasetCharacteristic)[keyof typeof Enums.DatasetCharacteristic];

export type DatasetFeatureRole =
  (typeof Enums.DatasetFeatureRole)[keyof typeof Enums.DatasetFeatureRole];

export type DatasetFeatureType =
  (typeof Enums.DatasetFeatureType)[keyof typeof Enums.DatasetFeatureType];

export type DatasetReportReason =
  (typeof Enums.DatasetReportReason)[keyof typeof Enums.DatasetReportReason];

export type DiscussionReportReason =
  (typeof Enums.DiscussionReportReason)[keyof typeof Enums.DiscussionReportReason];

export type ReportResolutionType =
  (typeof Enums.ReportResolutionType)[keyof typeof Enums.ReportResolutionType];

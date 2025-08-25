import { pgEnum } from "drizzle-orm/pg-core";

import { Enums, enumToArray } from "../types/enum";

export const approvalStatus = pgEnum("approval_status", enumToArray(Enums.ApprovalStatus));

export const datasetSubjectArea = pgEnum(
  "dataset_subject_area",
  enumToArray(Enums.DatasetSubjectArea),
);

export const datasetTask = pgEnum("dataset_task", enumToArray(Enums.DatasetTask));

export const datasetDataType = pgEnum("dataset_characteristic", enumToArray(Enums.DatasetDataType));

export const datasetFeatureRole = pgEnum(
  "dataset_feature_role",
  enumToArray(Enums.DatasetFeatureRole),
);

export const datasetFeatureType = pgEnum(
  "dataset_feature_type",
  enumToArray(Enums.DatasetFeatureType),
);

export const userRole = pgEnum("user_role", enumToArray(Enums.UserRole));

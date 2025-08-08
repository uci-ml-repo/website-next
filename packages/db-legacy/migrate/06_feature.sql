INSERT INTO
  feature (
    id,
    name,
    missing_values,
    description,
    units,
    dataset_id,
    role,
    type
  )
SELECT
  GEN_RANDOM_UUID(),
  lv.name,
  lv.missingvalues,
  NULLIF(TRIM(lv.description), ''),
  NULLIF(TRIM(lv.units), ''),
  lv.datasetid,
  CASE
    WHEN LOWER(TRIM(lv.role)) = ANY (ENUM_RANGE(NULL::dataset_feature_role)::TEXT[]) THEN LOWER(TRIM(lv.role))::dataset_feature_role
    ELSE 'other'::dataset_feature_role
  END,
  CASE
    WHEN LOWER(TRIM(lv.type)) = ANY (ENUM_RANGE(NULL::dataset_feature_type)::TEXT[]) THEN LOWER(TRIM(lv.type))::dataset_feature_type
    ELSE 'other'::dataset_feature_type
  END
FROM
  legacy.variables lv
  INNER JOIN public.dataset d ON d.id = lv.datasetid
WHERE
  TRIM(lv.name) <> ''
ON CONFLICT (dataset_id, name) DO NOTHING;

UPDATE dataset d
SET
  features = f.feature_names
FROM
  (
    SELECT
      dataset_id,
      ARRAY_AGG(
        name
        ORDER BY
          name
      ) AS feature_names
    FROM
      feature
    GROUP BY
      dataset_id
  ) f
WHERE
  d.id = f.dataset_id;

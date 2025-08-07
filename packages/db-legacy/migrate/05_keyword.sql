WITH
  keyword_uuid_map AS (
    SELECT
      id AS legacy_id,
      GEN_RANDOM_UUID() AS new_id,
      keyword,
      LOWER(REPLACE(status, 'ACCEPTED', 'approved')) AS status
    FROM
      legacy.keywords
  ),
  inserted AS (
    INSERT INTO
      public.keyword (id, name, status, created_at)
    SELECT
      new_id,
      keyword,
      status::approval_status,
      NOW()
    FROM
      keyword_uuid_map
    RETURNING
      id AS new_id,
      name
  )
SELECT
  kum.legacy_id,
  kum.new_id INTO TEMP TABLE temp_keyword_map
FROM
  keyword_uuid_map kum;

INSERT INTO
  public.dataset_keyword (keyword_id, dataset_id)
SELECT
  km.new_id,
  dk.datasetid
FROM
  legacy.dataset_keywords dk
  JOIN temp_keyword_map km ON dk.keywordsid = km.legacy_id
  JOIN public.dataset d ON dk.datasetid = d.id
ON CONFLICT (keyword_id, dataset_id) DO NOTHING;

UPDATE public.dataset d
SET
  keywords = sub.keyword_array
FROM
  (
    SELECT
      dk.dataset_id,
      ARRAY_AGG(
        k.name
        ORDER BY
          k.name
      ) AS keyword_array
    FROM
      public.dataset_keyword dk
      JOIN public.keyword k ON dk.keyword_id = k.id
    GROUP BY
      dk.dataset_id
  ) sub
WHERE
  d.id = sub.dataset_id;

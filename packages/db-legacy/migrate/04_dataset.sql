CREATE TEMP TABLE user_id_map AS
SELECT
  lu.id AS old_id,
  u.id AS new_id
FROM
  legacy.users lu
  JOIN "user" u ON lu."user" = u.email;

DO $$
  DECLARE rec RECORD;

  BEGIN
    FOR rec IN
      SELECT
        dd.id,
        LOWER(REPLACE(status, 'FAILED', 'rejected'))::approval_status          AS status,
        COALESCE(datedonated, CURRENT_TIMESTAMP)                               AS donated_at,
        COALESCE(yearcreated, EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::INTEGER)   AS year_created,
        name                                                                   AS title,
        TRIM(
          CONCAT_WS(
            E'\n\n',
            abstract,
            dq.otherinfo,
            CASE WHEN dq.preprocessingdescription IS NOT NULL THEN 'Preprocessing description:' || E'\n' || dq.preprocessingdescription END,
            CASE WHEN dq.sensitiveinfo IS NOT NULL THEN 'Does this dataset contains sensitive information?:' || E'\n' || regexp_replace(dq.sensitiveinfo, '^Yes\.?\s*', '') END,
            CASE WHEN vi.classlabels IS NOT NULL THEN 'Variables Info:' || E'\n' || vi.otherinfo END,
            CASE WHEN vi.otherinfo IS NOT NULL THEN 'Class labels:' || E'\n\n' || vi.classlabels END
          )
        )                                                             AS description,
        dq.datasetcitation                                            AS citation,
        REPLACE(REPLACE(LOWER(area), ' ', '_'), 'physical_science', 'physics_and_chemistry')::dataset_subject_area AS subject_area,
        numinstances                                                  AS instance_count,
        numfeatures                                                   AS feature_count,
        COALESCE(graphics, '') <> ''                                  AS has_graphics,
        COALESCE(isavailablepython, FALSE)                            AS is_available_python,
        numhits                                                       AS view_count,
        numdownloads                                                  AS download_count,
        slug,
        uim.new_id                                                    AS user_id,
        COALESCE(
          (SELECT ARRAY_AGG(x::dataset_characteristic)
           FROM UNNEST(STRING_TO_ARRAY(LOWER(dd.types), ', ')) x
           WHERE x = ANY (ENUM_RANGE(NULL::dataset_characteristic)::TEXT[])),
          '{}'
        )                                                             AS data_types,
        COALESCE(
          (SELECT ARRAY_AGG(x::dataset_task)
           FROM UNNEST(STRING_TO_ARRAY(LOWER(dd.task), ', ')) x
           WHERE x = ANY (ENUM_RANGE(NULL::dataset_task)::TEXT[])),
          '{}'
        )                                                             AS tasks,
        COALESCE(
          (SELECT ARRAY_AGG(x::dataset_feature_type)
           FROM UNNEST(STRING_TO_ARRAY(LOWER(REPLACE(dd.featuretypes, 'Real', 'Continuous')), ', ')) x
           WHERE x = ANY (ENUM_RANGE(NULL::dataset_feature_type)::TEXT[])),
          '{}'
        )                                                             AS feature_types,
        REGEXP_REPLACE(TRIM(doi), '^https?://doi.org/', '')           AS doi,
        urllink                                                       AS external_link,
        (SELECT COUNT(*)
         FROM legacy.dataset_file df
                INNER JOIN legacy.file_info fi ON fi.id = df.fileinfoid
         WHERE fi.datasetid = dd.id)                                  AS file_count,
        (SELECT compressedsize
         FROM legacy.file_info fi
         WHERE fi.datasetid = dd.id)                                  AS size
      FROM
        legacy.donated_datasets dd
          LEFT JOIN legacy.descriptive_questions dq ON dd.id = dq.datasetid
          LEFT JOIN legacy.variable_info vi ON dd.id = vi.datasetid
          LEFT JOIN user_id_map uim ON dd.userid = uim.old_id
      WHERE slug NOTNULL

      LOOP
        BEGIN
          INSERT INTO
            dataset (
             id,
             status,
             donated_at,
             year_created,
             title,
             description,
             citation,
             subject_area,
             instance_count,
             feature_count,
             has_graphics,
             is_available_python,
             view_count,
             download_count,
             slug,
             user_id,
             data_types,
             tasks,
             feature_types,
             doi,
             external_link,
             file_count,
             size
          )
          VALUES (
            rec.id,
            rec.status,
            rec.donated_at,
            rec.year_created,
            rec.title,
            rec.description,
            rec.citation,
            rec.subject_area,
            rec.instance_count,
            rec.feature_count,
            rec.has_graphics,
            rec.is_available_python,
            rec.view_count,
            CASE WHEN rec.external_link IS NOT NULL THEN NULL ELSE rec.download_count END,
            rec.slug,
            rec.user_id,
            rec.data_types,
            rec.tasks,
            rec.feature_types,
            rec.doi,
            rec.external_link,
            CASE WHEN rec.external_link IS NOT NULL THEN NULL ELSE rec.file_count END,
            CASE WHEN rec.external_link IS NOT NULL THEN NULL ELSE rec.size END
          );
        EXCEPTION
          WHEN OTHERS THEN
            IF rec.status != 'rejected' THEN
              RAISE NOTICE 'Skipping dataset id: %, status: %, error: %',
                rec.id, rec.status, SQLERRM;
            END IF;
        END;
      END LOOP;
  END;
$$;

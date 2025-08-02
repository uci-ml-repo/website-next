DROP TABLE legacy.tabular;

DROP TABLE legacy.edits;

DO $$
  DECLARE
    dataset_ids integer[] := ARRAY[387, 539, 1162];
  BEGIN
    DELETE FROM legacy.dataset_creators
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM legacy.dataset_notes
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM legacy.descriptive_questions
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM legacy.dataset_file USING legacy.file_info
    WHERE file_info.datasetid = ANY(dataset_ids)
      AND dataset_file.fileinfoid = file_info.id;

    DELETE FROM legacy.file_info
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM legacy.variable_info
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM legacy.variables
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM legacy.dataset_keywords
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM legacy.donated_datasets
    WHERE id = ANY(dataset_ids);
  END
$$;

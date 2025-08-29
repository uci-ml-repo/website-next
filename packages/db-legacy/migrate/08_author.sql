INSERT INTO
  public.author (
    id,
    first_name,
    last_name,
    institution,
    dataset_id
  )
SELECT
  GEN_RANDOM_UUID(),
  c.firstname,
  c.lastname,
  c.institution,
  d.id
FROM
  legacy.creators c
  INNER JOIN legacy.dataset_creators dc ON c.id = dc.creatorid
  INNER JOIN public.dataset d ON d.id = dc.datasetid

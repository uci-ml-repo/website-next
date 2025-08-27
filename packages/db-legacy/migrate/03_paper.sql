INSERT INTO
  paper (id, title, authors, venue, "year", url)
SELECT
  GEN_RANDOM_UUID(),
  np.title,
  STRING_TO_ARRAY(np.authors, ', '),
  np.venue,
  np.year,
  np.url
FROM
  legacy.dataset_papers dp
  INNER JOIN legacy.native_papers np ON dp.nativepaperid = np.id
  INNER JOIN legacy.donated_datasets dd ON dd.intropaperid = dp.datasetpapersid
WHERE
  dd.status = 'APPROVED'
  AND np.url IS NOT NULL;

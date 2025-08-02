INSERT INTO
  account (
    id,
    account_id,
    user_id,
    provider_id,
    password,
    created_at,
    updated_at
  )
SELECT
  GEN_RANDOM_UUID(),
  u.id,
  u.id,
  'credential',
  lu.pass,
  NOW(),
  NOW()
FROM
  legacy.users lu
  JOIN public."user" u ON lu.user = u.email
WHERE
  lu.pass IS NOT NULL;

WITH
  id_map AS (
    SELECT
      id AS old_id,
      GEN_RANDOM_UUID() AS new_id
    FROM
      legacy.users
  ),
  inserted AS (
    INSERT INTO
      public."user" (id, email, name, role)
    SELECT
      id_map.new_id,
      lu."user",
      lu.firstname || ' ' || lu.lastname,
      lu.role::TEXT::public.user_role
    FROM
      legacy.users lu
      JOIN id_map ON lu.id = id_map.old_id
    RETURNING
      id
  )
SELECT
  id_map.old_id,
  inserted.id AS new_id INTO TEMP TABLE user_id_map
FROM
  inserted
  JOIN id_map ON id_map.new_id = inserted.id;

UPDATE "user"
SET
  id = '00000000-0000-0000-0000-000000000000',
  name = 'UCI Machine Learning Repository',
  role = 'admin'
WHERE
  email = 'ucirepository@gmail.com';

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

-- create table users
-- (
--   id                      bigserial
--     constraint idx_16577_primary
--       primary key,
--   "user"                  varchar(45)                                          not null,
--   pass                    text,
--   role                    legacy.users_role default 'basic'::legacy.users_role not null,
--   accesstoken             text,
--   firstname               varchar(45)                                          not null,
--   lastname                varchar(45)                                          not null,
--   institution             text,
--   address                 text,
--   resetpasswordexpiration varchar(15),
--   resetpasswordtoken      varchar(100),
--   google                  text,
--   github                  text,
--   status                  varchar(45)       default 'ACTIVE'::character varying,
--   deletedat               timestamp with time zone,
--   githubid                text,
--   googleid                text
-- );
--
-- create table "user"
-- (
--   id             uuid                                 not null
--     primary key,
--   name           text                                 not null,
--   email          text                                 not null
--     constraint user_email_unique
--       unique,
--   email_verified boolean   default false              not null,
--   image          text,
--   role           user_role default 'basic'::user_role not null,
--   created_at     timestamp default now()              not null,
--   updated_at     timestamp default now()              not null
-- );
UPDATE "user"
SET
  id = '00000000-0000-0000-0000-000000000000',
  name = 'UCI Machine Learning Repository',
  role = 'admin'
WHERE
  email = 'ucirepository@gmail.com';

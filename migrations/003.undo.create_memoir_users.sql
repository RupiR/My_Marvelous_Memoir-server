ALTER TABLE memoir_posts
  DROP COLUMN IF EXISTS author_id;

DROP TABLE IF EXISTS memoir_users;

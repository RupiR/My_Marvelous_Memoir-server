CREATE TYPE post_category AS ENUM (
  'Listicle',
  'How-to',
  'News',
  'Interview',
  'Story'
);

ALTER TABLE memoir_posts
  ADD COLUMN
    style post_category;

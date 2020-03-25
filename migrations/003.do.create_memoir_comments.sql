CREATE TABLE memoir_comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    text TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    post_id INTEGER
        REFERENCES memoir_posts(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES memoir_users(id) ON DELETE CASCADE NOT NULL
);
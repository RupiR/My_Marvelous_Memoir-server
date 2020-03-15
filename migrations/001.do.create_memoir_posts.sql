CREATE TABLE memoir_posts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    content TEXT,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);

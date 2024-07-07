DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id VARCHAR,
    password VARCHAR
);

DROP TABLE IF EXISTS progress;
CREATE TABLE progress
(
    id VARCHAR,
    stage INTEGER,
    cleared VARCHAR
);
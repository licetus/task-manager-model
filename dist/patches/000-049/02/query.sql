
--------------------------------
-- admin schema and tables
--------------------------------

CREATE SCHEMA "document";

CREATE SEQUENCE "document".document_id_seq;

CREATE OR REPLACE FUNCTION "document".document_id(OUT result bigint) AS $$
DECLARE
	our_epoch bigint := 1466352806721;
	seq_id bigint;
	now_millis bigint;
	shard_id int := 0;
BEGIN
	SELECT nextval('"document".document_id_seq') % 128 INTO seq_id;
	SELECT FLOOR(EXTRACT(EPOCH FROM current_timestamp) * 1000) INTO now_millis;
	result := (now_millis - our_epoch) << 12;
	result := result | (shard_id << 7);
	result := result | (seq_id);
END;
$$ LANGUAGE PLPGSQL;

--------------------------------
-- Create admin table

CREATE TABLE "document".document
(
	id bigint DEFAULT "document".document_id() NOT NULL,
	type int NOT NULL,	-- 0 unknown, 1 image, 2 pdf, 3 audio
	url varchar NOT NULL,
	thumb_url varchar,
	name varchar NOT NULL,
	category int,
	content varchar,
	size bigint NOT NULL,
	create_time bigint DEFAULT unix_now(),
	last_update_time bigint DEFAULT unix_now(),
	PRIMARY KEY (id)
)
WITH (
	OIDS=FALSE
);

CREATE SEQUENCE "document".tag_id_seq START 1;

CREATE TABLE "document".tag
(
	id int DEFAULT nextval('"document".tag_id_seq') NOT NULL,
	name varchar NOT NULL,
	description varchar NOT NULL,
	create_time bigint DEFAULT unix_now(),
	last_update_time bigint DEFAULT unix_now(),
	PRIMARY KEY(id)
)
WITH (
	OIDS=FALSE
);

CREATE SEQUENCE "document".document_tag_id_seq START 100000000;

CREATE TABLE "document".document_tag
(
	id bigint DEFAULT nextval('"document".document_tag_id_seq') NOT NULL,
	document_id bigint NOT NULL REFERENCES "document".document ON DELETE CASCADE,
	tag_id int NOT NULL REFERENCES "document".tag ON DELETE CASCADE,
	create_time bigint DEFAULT unix_now(),
	last_update_time bigint DEFAULT unix_now(),
	PRIMARY KEY(id)
)
WITH (
	OIDS=FALSE
);

CREATE SEQUENCE "document".document_history_id_seq START 100000000;

CREATE TABLE "document".document_history
(
	id bigint DEFAULT nextval('"document".document_history_id_seq') NOT NULL,
	document_id bigint NOT NULL REFERENCES "document".document ON DELETE CASCADE,
	create_time bigint DEFAULT unix_now(),
	last_update_time bigint DEFAULT unix_now(),
	PRIMARY KEY(id)
)
WITH (
	OIDS=FALSE
);

CREATE VIEW "document".view_document AS
SELECT d.*, tags FROM "document".document AS d
LEFT JOIN (
	SELECT document_id, array_agg(tag_id) AS tags FROM "document".document_tag GROUP BY document_id
) AS dt ON d.id = dt.document_id;

CREATE VIEW "document".view_document_history AS
SELECT dh.view_time, d.* FROM (
    SELECT document_id, max(create_time) AS view_time FROM "document".document_history AS dh GROUP BY document_id
) AS dh
LEFT JOIN "document".document AS d
ON dh.document_id = d.id

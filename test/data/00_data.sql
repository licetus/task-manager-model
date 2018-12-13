
SET search_path = document, pg_catalog;

INSERT INTO document VALUES (203388799066113, 1, 'files/blue.jpeg', 'files/blue.jpeg', 'Rock and roll', 1, 'This is a test image', 30000, 1516008275244, 1516008275244);
INSERT INTO document VALUES (203388882522114, 1, 'files/glass.jpeg', 'files/glass.jpeg', 'Glassic ice fall', 1, 'This is a test image', 30000, 1516008295618, 1516008295618);
INSERT INTO document VALUES (203388960530435, 1, 'files/gray.jpeg', 'files/gray.jpeg', 'Gray Berlin Noise', 1, 'This is a test image', 30000, 1516008295618, 1516008295618);
INSERT INTO document VALUES (203388960530436, 1, 'files/paint.jpg', 'files/paint.jpg', 'Wall', 1, 'This is a test image', 30000, 1516008295618, 1516008295618);
INSERT INTO document VALUES (203388960530437, 1, 'files/purple.jpeg', 'files/purple.jpeg', 'Peacock', 1, 'This is a test image', 30000, 1516008295618, 1516008295618);
INSERT INTO document VALUES (203388960530438, 1, 'files/dirt.jpeg', 'files/dirt.jpeg', 'Shadow wolf', 1, 'This is a test image', 30000, 1516008314663, 1516008314663);
INSERT INTO document VALUES (203388960530439, 1, 'files/metal.jpeg', 'files/metal.jpeg', 'Silver light', 1, 'This is a test image', 30000, 1516008314663, 1516008314663);
INSERT INTO document VALUES (203388960530440, 1, 'files/brown.jpeg', 'files/brown.jpeg', 'Ancient Mystery', 1, 'This is a test image', 30000, 1516008314663, 1516008314663);
INSERT INTO document VALUES (203388960530441, 1, 'files/hammer.jpeg', 'files/hammer.jpeg', 'Hammer of Luo', 1, 'This is a test image', 30000, 1516008314663, 1516008314663);


INSERT INTO tag (id, name, description) VALUES (1, 'Sketch', 'Sketch');
INSERT INTO tag (id, name, description) VALUES (2, 'Art', 'Art');
INSERT INTO tag (id, name, description) VALUES (3, 'Budget', 'Budget');
INSERT INTO tag (id, name, description) VALUES (4, 'Abandoned', 'Emergency');
INSERT INTO tag (id, name, description) VALUES (5, 'Emergency', 'Emergency');

SELECT pg_catalog.setval('tag_id_seq', 6, true);

INSERT INTO document_tag (id, document_id, tag_id) VALUES(1, 203388799066113, 2);
INSERT INTO document_tag (id, document_id, tag_id) VALUES(2, 203388882522114, 1);
INSERT INTO document_tag (id, document_id, tag_id) VALUES(3, 203388960530436, 1);
INSERT INTO document_tag (id, document_id, tag_id) VALUES(4, 203388960530437, 1);
INSERT INTO document_tag (id, document_id, tag_id) VALUES(5, 203388960530437, 2);
INSERT INTO document_tag (id, document_id, tag_id) VALUES(6, 203388960530438, 1);
INSERT INTO document_tag (id, document_id, tag_id) VALUES(7, 203388960530440, 2);
INSERT INTO document_tag (id, document_id, tag_id) VALUES(8, 203388960530441, 1);

SELECT pg_catalog.setval('document_tag_id_seq', 9, true);
-- INSERT INTO admin VALUES (203388799066113, 'admin01', 'E10ADC3949BA59ABBE56E057F20F883E', 2, 1516008275244, 1516008275244);
-- INSERT INTO admin VALUES (203388882522114, 'operator01', 'E10ADC3949BA59ABBE56E057F20F883E', 3, 1516008295618, 1516008295618);
-- INSERT INTO admin VALUES (203388960530435, 'agent01', 'E10ADC3949BA59ABBE56E057F20F883E', 4, 1516008314663, 15160
-- SET search_path = document, pg_catalog;
--
-- SELECT pg_catalog.setval('document_id_seq', 3, true);

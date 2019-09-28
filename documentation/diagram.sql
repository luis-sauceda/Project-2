-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE "measurements" (
    "device_id" INTEGER   NOT NULL,
    "measurement_time" timestamp   NOT NULL,
    "power(W)" INTEGER   NOT NULL,
    "power_factor" FLOAT   NOT NULL,
    "energy(Wh)" INTEGER   NOT NULL
);

CREATE TABLE "device_groups" (
    "device_id" INTEGER   NOT NULL,
    "site_id" INTEGER   NOT NULL,
    "device_name" VARCHAR   NOT NULL,
    "dg1" VARCHAR   NOT NULL,
    "dg2" VARCHAR   NOT NULL,
    "dg3" VARCHAR   NOT NULL,
    CONSTRAINT "pk_device_groups" PRIMARY KEY (
        "device_id"
     )
);

CREATE TABLE "sites" (
    "site_id" INTEGER   NOT NULL,
    "site_name" VARCHAR   NOT NULL,
    "latitude" FLOAT   NOT NULL,
    "longitude" FLOAT   NOT NULL,
    CONSTRAINT "pk_sites" PRIMARY KEY (
        "site_id"
     )
);

ALTER TABLE "measurements" ADD CONSTRAINT "fk_measurements_device_id" FOREIGN KEY("device_id")
REFERENCES "device_groups" ("device_id");

ALTER TABLE "device_groups" ADD CONSTRAINT "fk_device_groups_site_id" FOREIGN KEY("site_id")
REFERENCES "sites" ("site_id");


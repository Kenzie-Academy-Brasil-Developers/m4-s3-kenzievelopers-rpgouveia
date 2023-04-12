CREATE TABLE developers (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TYPE "OS" AS ENUM ('Windows', 'Linux', 'MacOs');

CREATE TABLE developers_info (
	"id" SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOs" "OS" NOT NULL,
	"developerId" INTEGER UNIQUE,
	FOREIGN KEY ("developerId") REFERENCES developers("id")
);
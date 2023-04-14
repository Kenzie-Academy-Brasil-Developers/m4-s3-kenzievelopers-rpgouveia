CREATE TABLE IF NOT EXISTS developers (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) NOT NULL UNIQUE
);

-- DROP TYPE IF EXISTS "OS";
CREATE TYPE "OS" AS ENUM ('Windows', 'Linux', 'MacOs');

CREATE TABLE IF NOT EXISTS developer_infos (
	"id" SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOS" "OS" NOT NULL,
	"developerId" INTEGER UNIQUE,
	FOREIGN KEY ("developerId") REFERENCES developers ("id") ON DELETE CASCADE
);
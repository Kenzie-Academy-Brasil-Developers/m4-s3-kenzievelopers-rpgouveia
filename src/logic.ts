import { Request, Response } from "express";
import { iDeveloper, iDeveloperRequest } from "./interfaces";
import format from "pg-format";
import { QueryResult } from "pg";
import { client } from "./database";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const developerData: iDeveloperRequest = request.body;
  console.log('developerData', developerData);

  const query: string = format(`
  INSERT INTO
    developers (%I)
  VALUES
    (%L)
  RETURNING *;
`,
  Object.keys(developerData),
  Object.values(developerData)
);

  const queryResult: QueryResult<iDeveloper> = await client.query(query);
  console.log(queryResult);

  return response.status(201).json(queryResult.rows[0]);
};

export { createDeveloper };

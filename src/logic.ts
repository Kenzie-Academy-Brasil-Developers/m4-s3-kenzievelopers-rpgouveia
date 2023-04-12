import { Request, Response } from "express";
import { iDeveloper, iDeveloperInfoRequest, iDeveloperRequest } from "./interfaces";
import format from "pg-format";
import { QueryResult } from "pg";
import { client } from "./database";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise <Response> => {
  const developerData: iDeveloperRequest = request.body;
  
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

  return response.status(201).json(queryResult.rows[0]);
};

const createDeveloperInfo = async (
  request: Request,
  response: Response
): Promise <Response> => {
  const id = Number(request.params.id);
  const developerInfo: iDeveloperInfoRequest = request.body;
  developerInfo.developerId = id;

  const query: string = format(`
  INSERT INTO
    developers_info (%I)
  VALUES
    (%L)
  RETURNING *;
  `,
  Object.keys(developerInfo),
  Object.values(developerInfo)
  );

  const queryResult: QueryResult = await client.query(query)
  
  return response.status(201).json(queryResult.rows[0])
};

export {
  createDeveloper,
  createDeveloperInfo
};
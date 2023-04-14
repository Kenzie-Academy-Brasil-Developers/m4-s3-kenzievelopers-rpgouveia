import { Request, Response } from "express";
import { iDeveloper, iDeveloperInfo, iDeveloperInfoRequest, iDeveloperRequest, iGetDeveloperRequest } from "./interfaces";
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

  const queryResult: QueryResult<iDeveloperInfo> = await client.query(query)
  
  return response.status(201).json(queryResult.rows[0])
};

const getDevelopers = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const query: string = `
    SELECT 
      d.id "developerId",
      d."name" "developerName",
      d.email "developerEmail",
      di."developerSince" "developerInfoDeveloperSince",
      di."preferredOS" "developerInfoPreferredOS"
    FROM
      developers d 
    JOIN
      developers_info di 
    ON
      d."id" = di."developerId" ;
  `;

  const queryResult: QueryResult<iGetDeveloperRequest> = await client.query(query);

  return response.status(200).json(queryResult.rows)
};

export {
  createDeveloper,
  createDeveloperInfo,
  getDevelopers
};
import { Request, Response } from "express";
import { iDeveloper, iDeveloperInfos, iDeveloperInfosRequest, iDeveloperRequest, iRetrieveDeveloperRequest } from "../interfaces/developers.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

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

const createDeveloperInfos = async (
  request: Request,
  response: Response
): Promise <Response> => {
  const id = Number(request.params.id);
  const developerInfos: iDeveloperInfosRequest = request.body;
  developerInfos.developerId = id;

  const query: string = format(`
  INSERT INTO
    developer_infos (%I)
  VALUES
    (%L)
  RETURNING *;
  `,
  Object.keys(developerInfos),
  Object.values(developerInfos)
  );

  const queryResult: QueryResult<iDeveloperInfos> = await client.query(query)
  
  return response.status(201).json(queryResult.rows[0])
};

const retrieveDeveloper = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const id = Number(request.params.id);
    
  const query: string = `
    SELECT 
      d.id "developerId",
      d.name "developerName",
      d.email "developerEmail",
      di."developerSince" "developerInfoDeveloperSince",
      di."preferredOS" "developerInfoPreferredOS"
    FROM
      developers d 
    LEFT JOIN
      developer_infos di ON d."id" = di."developerId"
    WHERE d."id" = $1;
  `;
  const queryConfig: QueryConfig = { text: query, values: [id]};
  const queryResult: QueryResult<iRetrieveDeveloperRequest> = await client.query(queryConfig);
  
  return response.status(200).json(queryResult.rows[0])
};

const updateDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = Number(request.params.id);
  const developerData: Partial <iDeveloperRequest> = request.body;
  const query: string = format(`
    UPDATE
      developers
    SET (%I) = ROW (%L)
    WHERE 
      id = $1
    RETURNING *;
  `,
  Object.keys(developerData),
  Object.values(developerData));
  const queryConfig: QueryConfig = { text: query, values: [id] };
  const queryResult: QueryResult<iDeveloper> = await client.query(queryConfig);
  return response.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = Number(request.params.id);
  const query: string = `DELETE FROM developers WHERE id = $1`;
  const queryConfig: QueryConfig = { text: query, values: [id] };
  await client.query(queryConfig);
  return response.status(204).send();
};

export {
  createDeveloper,
  createDeveloperInfos,
  retrieveDeveloper,
  updateDeveloper,
  deleteDeveloper
};
import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { iDeveloper, iDeveloperInfos, iEnumRange } from "../interfaces/developers.interfaces";
import { client } from "../database";

const checkDeveloperId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = Number(request.params.id);
  const query: string = `SELECT * FROM developers WHERE id = $1;`;
  const queryConfig: QueryConfig = { text: query, values:[id] };
  const queryResult: QueryResult<iDeveloper> = await client.query(queryConfig);
  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found."
    })
  };
  response.locals.developerId = queryResult.rows[0];
  return next();
};

const checkEmailExists = async (
  request: Request,
  response: Response,
  next: NextFunction): Promise<Response | void> => {
  const developerData: iDeveloper = request.body;
  const query: string = `SELECT * FROM developers WHERE email = $1;`;
  const queryConfig: QueryConfig = { text: query, values: [developerData.email]};
  const queryResult: QueryResult<iDeveloper> = await client.query(queryConfig);
  if (queryResult.rows.length > 0) {
    return response.status(409).json({
      message: "Email already exists."
    })
  };
  return next();
};

const checkInfosExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const developerId: number = Number(request.params.id);
  const query: string = `SELECT * FROM developer_infos WHERE "developerId" = $1;`;
  const queryConfig: QueryConfig = { text: query, values: [developerId] };
  const queryResult: QueryResult<iDeveloperInfos> = await client.query(queryConfig);
  if (queryResult.rowCount === 0) {
    return next();
  }
  return response.status(409).json({
    message: "Developer infos already exists."
  })
};

const checkPreferredOS = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const query: string = `SELECT enum_range(NULL::"OS");`;
  const queryResult: QueryResult<iEnumRange> = await client.query(query);
  const optionsOS: string = queryResult.rows[0].enum_range;
  const preferredOS: string = request.body.preferredOS;
  if (optionsOS.includes(preferredOS)) {
    return next();
  };
  return response.status(400).json({
    message: "Invalid OS option.",
    options: ["Windows", "Linux", "MacOS"]
  })
};

export {
  checkDeveloperId,
  checkEmailExists,
  checkInfosExists,
  checkPreferredOS
};
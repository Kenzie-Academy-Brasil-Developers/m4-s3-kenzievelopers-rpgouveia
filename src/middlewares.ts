import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { iDeveloper } from "./interfaces";
import { client } from "./database";

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
  return next();
};

const checkEmailExists = async (
  request: Request,
  response: Response,
  next: NextFunction): Promise<Response | void> => {
  const developerData: iDeveloper = request.body;
  const query = `SELECT * FROM developers WHERE email = $1;`;
  const queryConfig: QueryConfig = { text: query, values: [developerData.email]};
  const queryResult: QueryResult<iDeveloper> = await client.query(queryConfig);
  if (queryResult.rows.length > 0) {
    return response.status(409).json({
      message: "Email already exists."
    })
  };
  return next();
};

export {
  checkDeveloperId,
  checkEmailExists
};
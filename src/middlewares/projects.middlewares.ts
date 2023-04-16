import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { iDeveloper } from "../interfaces/developers.interfaces";
import { client } from "../database";

const checkProjectId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId = Number(request.params.id);
    
  const query: string = `SELECT * FROM projects WHERE id = $1;`;
  const queryConfig: QueryConfig = { text: query, values:[projectId] };
  const queryResult: QueryResult<iDeveloper> = await client.query(queryConfig);
  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Project not found."
    })
  };
  return next();
};

export {
  checkProjectId
}
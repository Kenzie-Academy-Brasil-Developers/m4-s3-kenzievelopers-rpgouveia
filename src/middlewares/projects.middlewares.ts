import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { iDeveloper } from "../interfaces/developers.interfaces";
import { client } from "../database";
import { iProjectTechnology, iTechnology, iValidTechnologyResult } from "../interfaces/projects.interfaces";

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

const checkValidTechnology = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const technologyName = request.body.name;
  const query: string = `SELECT name FROM technologies;`;
  const queryConfig: QueryConfig = { text: query };
  const queryResult: QueryResult<iValidTechnologyResult> = await client.query(queryConfig);
  const validTechnologies: string[] = queryResult.rows.map(tech => tech.name);
  if (!validTechnologies.includes(technologyName)) {
    return response.status(400).json({
      message: 'Technology not supported.',
      options: validTechnologies
    });
  };

  return next();
};

const checkTechnologyExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId = Number(request.params.id);
  const technologyName: string = request.body.name;

  const searchQuery: string = `SELECT * FROM technologies t WHERE t.name = $1;`;
  const searchQueryConfig: QueryConfig = { text: searchQuery, values: [technologyName] };
  const searchQueryResult: QueryResult<iTechnology> = await client.query(searchQueryConfig);
  const technologyId = searchQueryResult.rows[0].id;

  const technologyQuery: string = `
    SELECT
      *
    FROM
      projects_technologies
    WHERE
      "technologyId" = $1 AND "projectId" = $2;
  `
  const technologyQueryConfig: QueryConfig = { text:technologyQuery, values: [technologyId, projectId] };
  const technologyQueryResult: QueryResult<iProjectTechnology> = await client.query(technologyQueryConfig);

  if (technologyQueryResult.rowCount > 0) {
    return response.status(409).json({
      message: "This technology is already associated with the project"
    })
  };
  
  return next();
};

export {
  checkProjectId,
  checkValidTechnology,
  checkTechnologyExists
}
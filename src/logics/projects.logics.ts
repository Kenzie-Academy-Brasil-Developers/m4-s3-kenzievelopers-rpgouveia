import { Request, Response } from "express";
import { iProject } from "../interfaces/projects.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projectData: iProject = request.body;

  const query: string = format(
    `
    INSERT INTO
      projects (%I)
    VALUES
      (%L)
    RETURNING *;
  `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult<iProject> = await client.query(query);
    
  return response.status(201).json(queryResult.rows[0]);
};

const retrieveProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = request.params.id;
  const query: string = `
  SELECT
    p.id "projectId",
    p.name "projectName",
    p.description "projectDescription",
    p."estimatedTime" "projectEstimatedTime",
    p.repository "projectRepository",
    p."startDate" "projectStartDate",
    p."endDate" "projectEndDate",
    p."developerId" "projectDeveloperId",
    pt."technologyId",
    t."name" "technologyName"
  FROM
    projects p
  LEFT JOIN
    projects_technologies pt
  ON
    p.id = pt."projectId"
  LEFT JOIN
    technologies t
  ON
    pt."technologyId" = t.id 
  WHERE
    p."developerId" = $1;
`;
  const queryConfig: QueryConfig = { text: query, values: [id]};
  const queryResult: QueryResult = await client.query(queryConfig);
    
  return response.status(200).json(queryResult.rows);
};

export {
  createProject,
  retrieveProject
};

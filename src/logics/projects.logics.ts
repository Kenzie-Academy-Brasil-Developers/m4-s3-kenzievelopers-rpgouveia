import { Request, Response } from "express";
import { iAddTechnologyResponse, iProject, iProjectTechnology, iTechnology } from "../interfaces/projects.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projectData: iProject = request.body;

  const query: string = format(`
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
  const id = Number(request.params.id);
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
    p.id = $1;
`;
  const queryConfig: QueryConfig = { text: query, values: [id] };
  const queryResult: QueryResult = await client.query(queryConfig);
    
  return response.status(200).json(queryResult.rows);
};

const updateProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = Number(request.params.id);
  const projectData: Partial<iProject> = request.body;
  const query: string = format(`
    UPDATE
      projects p 
    SET (%I) = ROW (%L)
    WHERE
      p.id = $1
    RETURNING *;
  `,
  Object.keys(projectData),
  Object.values(projectData)
  );

  const queryConfig: QueryConfig = { text: query, values: [id] };
  const queryResult: QueryResult<iProject> = await client.query(queryConfig);
  
  return response.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = Number(request.params.id);

  const query: string = `
  DELETE FROM
    projects
  WHERE 
    id = $1;
  `;

  const queryConfig: QueryConfig = { text: query, values: [id] };
  await client.query(queryConfig);

  return response.status(204).send();
};

const addTechnology = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const currentDate = new Date().toISOString().split('T')[0];
  const projectId = Number(request.params.id);
  const technologyName: string = request.body.name;

  const searchQuery: string = `SELECT * FROM technologies t WHERE t.name = $1;`;
  const searchQueryConfig: QueryConfig = { text: searchQuery, values: [technologyName] };
  const searchQueryResult: QueryResult<iTechnology> = await client.query(searchQueryConfig);
  const technologyId = searchQueryResult.rows[0].id;
  
  const insertQuery: string = `
    INSERT INTO
      projects_technologies ("addedIn", "technologyId", "projectId")
    VALUES
      ($1, $2, $3)
    RETURNING *;
  `;
  const insertQueryConfig: QueryConfig = { text: insertQuery, values: [currentDate, technologyId, projectId] };
  const insertQueryResult: QueryResult<iProjectTechnology> = await client.query(insertQueryConfig);
  const insertData: iProjectTechnology = insertQueryResult.rows[0];
  
  const projectQuery: string = `SELECT * FROM projects p WHERE p.id = $1;`;
  const projectQueryConfig: QueryConfig = { text: projectQuery, values: [projectId] };
  const projectQueryResult: QueryResult<iProject> = await client.query(projectQueryConfig);
  const projectData: iProject = projectQueryResult.rows[0];

  const addTechnologyResponse: iAddTechnologyResponse = {
    technologyId: insertData.technologyId,
    technologyName: technologyName,
    projectId: insertData.projectId,
    projectName: projectData.name,
    projectDescription: projectData.description,
    projectEstimatedTime: projectData.estimatedTime,
    projectRepository: projectData.repository,
    projectStartDate: projectData.startDate,
    projectEndDate: projectData.endDate
  };
  
  return response.status(201).json(addTechnologyResponse);
};

export {
  createProject,
  retrieveProject,
  updateProject,
  deleteProject,
  addTechnology
};

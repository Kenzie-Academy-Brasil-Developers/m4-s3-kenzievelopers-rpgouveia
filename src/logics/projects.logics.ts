import { Request, Response } from "express";
import { iProject } from "../interfaces/projects.interfaces";
import format from "pg-format";
import { QueryResult } from "pg";
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

export { createProject };

import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfos, deleteDeveloper, retrieveDeveloper, updateDeveloper } from "./logics/developers.logics";
import { checkDeveloperId, checkEmailExists, checkInfosExists, checkPreferredOS } from "./middlewares/developers.middlewares";
import { createProject, deleteProject, retrieveProject, updateProject } from "./logics/projects.logics";
import { checkProjectId } from "./middlewares/projects.middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkEmailExists, createDeveloper);
app.post("/developers/:id/infos", checkDeveloperId, checkInfosExists, checkPreferredOS, createDeveloperInfos);
app.get("/developers/:id", checkDeveloperId, retrieveDeveloper);
app.patch("/developers/:id", checkDeveloperId, checkEmailExists, updateDeveloper);
app.delete("/developers/:id", checkDeveloperId, deleteDeveloper);

app.post("/projects", checkDeveloperId, createProject);
app.get("/projects/:id", checkProjectId, retrieveProject);
app.patch("/projects/:id", checkProjectId, checkDeveloperId, updateProject);
app.delete("/projects/:id", checkProjectId, deleteProject);

export default app;
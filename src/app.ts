import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfo, deleteDeveloper, getDevelopers, updateDeveloper } from "./logic";
import { checkDeveloperId, checkEmailExists, checkInfosExists, checkPreferredOS } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkEmailExists, createDeveloper);
app.post("/developers/:id/infos", checkDeveloperId, checkInfosExists, checkPreferredOS, createDeveloperInfo);
app.get("/developers/:id", checkDeveloperId, getDevelopers);
app.patch("/developers/:id", checkDeveloperId, checkEmailExists, updateDeveloper);
app.delete("/developers/:id", checkDeveloperId, deleteDeveloper);

export default app;
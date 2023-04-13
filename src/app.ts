import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfo } from "./logic";
import { checkDeveloperId, checkEmailExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkEmailExists, createDeveloper);
app.post("/developers/:id/infos", checkDeveloperId, createDeveloperInfo);

export default app;
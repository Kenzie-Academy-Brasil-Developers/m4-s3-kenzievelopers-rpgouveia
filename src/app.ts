import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper, createDeveloperInfo } from "./logic";

const app: Application = express();
app.use(express.json());

app.post("/developers", createDeveloper);
app.post("/developers/:id/infos", createDeveloperInfo);

export default app;
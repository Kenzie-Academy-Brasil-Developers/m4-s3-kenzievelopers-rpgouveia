import express, { Application } from "express";
import "dotenv/config";
import { createDeveloper } from "./logic";

const app: Application = express();
app.use(express.json());

app.post("/developers", createDeveloper);

export default app;
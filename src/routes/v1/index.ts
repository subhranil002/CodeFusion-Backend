import { Router } from "express";
import editorRouter from "./editor.routes.js";
import healthCheckRouter from "./healthCheck.routes.js";

const v1Router = Router();

v1Router.use("/editor", editorRouter);
v1Router.use("/health", healthCheckRouter);

export default v1Router;

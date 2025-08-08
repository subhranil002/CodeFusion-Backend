import { Router } from "express";
import editorRouter from "./editor.routes.js";
import healthCheckRouter from "./healthCheck.routes.js";
import userRouter from "./user.routes.js";
import roomRouter from "./room.routes.js";

const v1Router = Router();

v1Router.use("/health", healthCheckRouter);
v1Router.use("/editor", editorRouter);
v1Router.use("/users", userRouter);
v1Router.use("/rooms", roomRouter);

export default v1Router;

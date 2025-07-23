import v1Router from "./v1/index.js";
import { Router } from "express";

const appRouter = Router();

appRouter.use("/v1", v1Router);

export default appRouter;

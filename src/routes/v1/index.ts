import router from "./code-executer.routes.js";
import { Router } from "express";

const v1Router = Router();

v1Router.use("/code", router);

export default v1Router;

import { getLanguages } from "../../controllers/code-executer.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/languages", getLanguages);

export default router;

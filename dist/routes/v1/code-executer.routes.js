import { codeRunner, getLanguages } from "../../controllers/code-executer.controllers.js";
import { Router } from "express";
const router = Router();
router.get("/languages", getLanguages);
router.post("/run", codeRunner);
export default router;

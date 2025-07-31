import { codeRunner, getLanguages } from "../../controllers/editor.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/languages", getLanguages);
router.post("/run", codeRunner);

export default router;

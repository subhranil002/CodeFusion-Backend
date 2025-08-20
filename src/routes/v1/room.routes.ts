import { Router } from "express";
import {
    codeRunner,
    createRoom,
    getLanguages,
    updateRoom,
} from "../../controllers/room.controllers.js";
import { isLoggedIn } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/languages", isLoggedIn, getLanguages);
router.post("/run", isLoggedIn, codeRunner);
router.post("/create", isLoggedIn, createRoom);
router.post("/update/:roomId", isLoggedIn, updateRoom);

export default router;

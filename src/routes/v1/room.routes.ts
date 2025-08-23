import { Router } from "express";
import {
    codeRunner,
    createRoom,
    deleteRoom,
    getLanguages,
    joinRoom,
    updateRoom,
} from "../../controllers/room.controllers.js";
import { isLoggedIn } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/languages", isLoggedIn, getLanguages);
router.post("/run", isLoggedIn, codeRunner);
router.get("/join/:roomId", isLoggedIn, joinRoom);
router.post("/create", isLoggedIn, createRoom);
router.put("/update/:roomId", isLoggedIn, updateRoom);
router.delete("/delete/:roomId", isLoggedIn, deleteRoom);

export default router;

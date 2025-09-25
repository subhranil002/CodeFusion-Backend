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
import {
    checkCodeExecutionLimits,
    checkRoomLimits,
} from "../../middlewares/subscription.middleware.js";

const router = Router();

router.get("/languages", getLanguages);
router.post("/run", isLoggedIn, checkCodeExecutionLimits, codeRunner);
router.get("/join/:roomId", isLoggedIn, joinRoom);
router.post("/create", isLoggedIn, checkRoomLimits, createRoom);
router.put("/update/:roomId", isLoggedIn, updateRoom);
router.delete("/delete/:roomId", isLoggedIn, deleteRoom);

export default router;

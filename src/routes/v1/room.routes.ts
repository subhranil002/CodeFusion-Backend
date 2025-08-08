import { Router } from "express";
import { createRoom } from "../../controllers/room.controllers.js";
import { isLoggedIn } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", isLoggedIn, createRoom);

export default router;

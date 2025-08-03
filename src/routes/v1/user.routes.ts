import { Router } from "express";
import {
    guestLogin,
    login,
    logout,
    register,
} from "../../controllers/user.controllers.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/guest-login", guestLogin);
router.get("/logout", logout);

export default router;

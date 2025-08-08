import { Router } from "express";
import {
    changeAvatar,
    getMyRooms,
    getProfile,
    guestLogin,
    login,
    logout,
    register,
} from "../../controllers/user.controllers.js";
import upload from "../../middlewares/multer.middleware.js";
import {
    authorizedRoles,
    isLoggedIn,
} from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/guest-login", guestLogin);
router.get("/logout", isLoggedIn, logout);
router.post(
    "/avatar",
    isLoggedIn,
    authorizedRoles(["ADMIN", "CODER"]),
    upload.single("avatar"),
    changeAvatar
);
router.get("/profile", isLoggedIn, getProfile);
router.get("/rooms", isLoggedIn, getMyRooms);

export default router;

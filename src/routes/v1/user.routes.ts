import { Router } from "express";
import {
    changeAvatar,
    changePassword,
    contactUs,
    forgotPassword,
    getMyRooms,
    getProfile,
    guestLogin,
    login,
    logout,
    register,
    resetPassword,
    updateProfile,
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
router.put(
    "/update",
    isLoggedIn,
    authorizedRoles(["ADMIN", "CODER"]),
    updateProfile
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post(
    "/change-password",
    isLoggedIn,
    authorizedRoles(["ADMIN", "CODER"]),
    changePassword
);
router.get("/rooms", isLoggedIn, getMyRooms);
router.post("/contact", contactUs);

export default router;

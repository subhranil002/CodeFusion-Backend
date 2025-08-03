import { User } from "../models/index.js";
import {
    loginGuest,
    loginUser,
    logoutUser,
    registerUser,
} from "../services/user.services.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const register = asyncHandler(async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            throw new ApiError("All fields are required", 400);
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new ApiError("Email already exists", 400);
        }

        const { user, accessToken, refreshToken } = await registerUser({
            fullName,
            email,
            password,
        });

        return res
            .status(201)
            .json(new ApiResponse("User registered successfully", user))
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: register: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const login = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError("All fields are required", 400);
        }

        const { user, accessToken, refreshToken } = await loginUser({
            email,
            password,
        });

        return res
            .status(200)
            .json(new ApiResponse("Logged in successfully", user))
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: login: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const guestLogin = asyncHandler(async (req, res, next) => {
    try {
        const { user, accessToken } = await loginGuest();

        return res
            .status(200)
            .json(new ApiResponse("Logged in successfully", user))
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/",
            });
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: login: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const logout = asyncHandler(async (req: any, res, next) => {
    try {
        await logoutUser(req.user._id);

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        }).clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return res
            .status(200)
            .json(new ApiResponse("User logged out successfully"));
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: logout: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

export { register, login, guestLogin, logout };

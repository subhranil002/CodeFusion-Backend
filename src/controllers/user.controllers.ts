import { User } from "../models/index.js";
import {
    getRoomsByUser,
    loginGuest,
    loginUser,
    logoutUser,
    registerUser,
    updateAvatar,
    updateUserData,
} from "../services/user.services.js";
import {
    ApiError,
    ApiResponse,
    asyncHandler,
    fileHandler,
} from "../utils/index.js";

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

        const { user, accessToken, refreshToken } = await registerUser(
            fullName,
            email,
            password
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res
            .status(201)
            .json(new ApiResponse("User registered successfully", user));
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

        const { user, accessToken, refreshToken } = await loginUser(
            email,
            password
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res
            .status(200)
            .json(new ApiResponse("Logged in successfully", user));
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

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res
            .status(200)
            .json(new ApiResponse("Logged in successfully", user));
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

const changeAvatar = asyncHandler(async (req: any, res, next) => {
    try {
        const avatarLocalPath = req.file ? req.file.path : "";
        if (!avatarLocalPath) {
            throw new ApiError("No avatar file provided", 400);
        }

        const updatedUser: any = await updateAvatar(req.user, avatarLocalPath);

        return res
            .status(200)
            .json(new ApiResponse("Avatar changed successfully", updatedUser));
    } catch (error: any) {
        await fileHandler.deleteLocalFiles();
        return next(
            new ApiError(
                `user.controller :: changeAvatar: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const getProfile = asyncHandler(async (req: any, res, next) => {
    try {
        return res
            .status(200)
            .json(new ApiResponse("Profile fetched successfully", req.user));
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: getProfile: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const updateProfile = asyncHandler(async (req: any, res, next) => {
    try {
        const { fullName, email } = req.body;

        const updatedUser = await updateUserData(req.user, fullName, email);

        return res
            .status(200)
            .json(new ApiResponse("Profile updated successfully", updatedUser));
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: updateProfile: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

// const forgetPassword = asyncHandler(async (req: any, res, next) => {});

// const resetPassword = asyncHandler(async (req: any, res, next) => {});

// const changePassword = asyncHandler(async (req: any, res, next) => {});

// const contactUs = asyncHandler(async (req: any, res, next) => {});

const getMyRooms = asyncHandler(async (req: any, res, next) => {
    try {
        if (req.user.rooms.length === 0) {
            return res
                .status(200)
                .json(new ApiResponse("You have not created any rooms yet"));
        }

        const rooms: any = await getRoomsByUser(req.user);

        return res
            .status(200)
            .json(new ApiResponse("My rooms fetched successfully", rooms));
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: getMyRooms: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

export {
    register,
    login,
    guestLogin,
    logout,
    changeAvatar,
    getProfile,
    updateProfile,
    getMyRooms,
};

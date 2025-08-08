import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import constants from "../constants.js";
import { User } from "../models/index.js";
import { generateAccessAndRefreshToken } from "../utils/index.js";

const refreshAccessToken = async (req: any, res: any, next: any) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw new ApiError("Session expired! Please login again", 455);
        }

        let decodedRefreshToken: any;
        try {
            decodedRefreshToken = jwt.verify(
                refreshToken,
                constants.REFRESH_TOKEN_SECRET
            );
        } catch (err) {
            throw new ApiError("Session expired! Please login again", 455);
        }

        const user = await User.findById(decodedRefreshToken?._id);
        if (!user) {
            throw new ApiError("User not found", 455);
        }
        if (user.refreshToken !== refreshToken) {
            throw new ApiError("Session expired! Please login again", 455);
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();
        req.user = user;

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        }).cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        next();
    } catch (error: any) {
        return next(
            new ApiError(
                `auth.middleware :: refreshAccessToken: ${
                    error.message || error
                }`,
                error.statusCode || 500
            )
        );
    }
};

const isLoggedIn = async (req: any, res: any, next: any) => {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new ApiError("Please login to continue", 455);
        }

        try {
            const decodedAccessToken: any = jwt.verify(
                accessToken,
                constants.ACCESS_TOKEN_SECRET
            );

            const user = await User.findById(decodedAccessToken?._id);
            if (!user) {
                throw new ApiError("User not found", 455);
            }

            req.user = user;
            next();
        } catch (error) {
            if (req.cookies.refreshToken) {
                return refreshAccessToken(req, res, next);
            } else {
                throw new ApiError("Please login to continue", 455);
            }
        }
    } catch (error: any) {
        return next(
            new ApiError(
                `auth.middleware :: isLoggedIn: ${error.message || error}`,
                error.statusCode || 500
            )
        );
    }
};

type Role = "ADMIN" | "CODER" | "GUEST";

const authorizedRoles =
    (roles: Role[]) =>
    (req: any, res: any, next: any) => {
        if (!req.user) {
            return next(new ApiError("Authentication required", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError("You are not authorized to access this route", 403)
            );
        }

        next();
    };

export { isLoggedIn, authorizedRoles };

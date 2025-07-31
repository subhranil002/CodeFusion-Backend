import ApiError from "./ApiError.js";
import { userDocument } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (user: userDocument) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            `Something went wrong while generating tokens ${error}`,
            500
        );
    }
};

export default generateAccessAndRefreshToken;

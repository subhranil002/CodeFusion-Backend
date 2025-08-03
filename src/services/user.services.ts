import constants from "../constants.js";
import { User } from "../models/index.js";
import { userDocument } from "../models/user.model.js";
import {
    ApiError,
    generateAccessAndRefreshToken,
} from "../utils/index.js";

const registerUser = async ({
    fullName,
    email,
    password,
}: {
    fullName: string;
    email: string;
    password: string;
}) => {
    try {
        const user = new User({
            fullName,
            email,
            password,
        });

        if (!user) {
            throw new ApiError(
                "User registration failed, please try again",
                500
            );
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();
        user.password = "";
        user.refreshToken = "";
        return {
            user,
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw error;
    }
};

const loginUser = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.isPasswordCorrect(password))) {
            throw new ApiError("Invalid email or password", 401);
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();
        user.refreshToken = "";
        user.password = "";
        return {
            user,
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw error;
    }
};

const loginGuest = async () => {
    try {
        const user: any = await User.findById(constants.GUEST_ID);
        const { accessToken } = await generateAccessAndRefreshToken(user);
        return {
            user,
            accessToken,
        };
    } catch (error) {
        throw error;
    }
};

const logoutUser = async (_id: string) => {
    try {
        const user: any = await User.findById(_id);
        user.refreshToken = "";
        await user.save();
    } catch (error) {
        throw error;
    }
};

export { registerUser, loginUser, loginGuest, logoutUser };

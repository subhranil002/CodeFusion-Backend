import constants from "../constants.js";
import { User } from "../models/index.js";
import {
    ApiError,
    fileHandler,
    generateAccessAndRefreshToken,
} from "../utils/index.js";

const registerUser = async (
    fullName: string,
    email: string,
    password: string
) => {
    try {
        const user = await User.create({
            fullName,
            email,
            password,
        });
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

const loginUser = async (email: string, password: string) => {
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

const updateAvatar = async (user: any, avatarLocalPath: any) => {
    try {
        const newAvatar: {
            public_id: string;
            secure_url: string;
        } | null = await fileHandler.uploadImageToCloud(avatarLocalPath);
        if (!newAvatar?.public_id || !newAvatar?.secure_url) {
            throw new ApiError("Error uploading avatar", 400);
        }

        const result = await fileHandler.deleteCloudFile(
            user?.avatar?.public_id
        );
        if (!result) {
            await fileHandler.deleteCloudFile(newAvatar.public_id);
            throw new ApiError("Error deleting old avatar", 400);
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                avatar: {
                    public_id: newAvatar.public_id,
                    secure_url: newAvatar.secure_url,
                },
            },
            { new: true }
        ).select("avatar");

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

const updateUserData = async (user: any, fullName?: string, email?: string) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                fullName,
                email,
            },
            { new: true }
        );

        return updatedUser;
    } catch (error) {
        throw error;
    }
};

const getRoomsByUser = async (user: any) => {
    try {
        const rooms = await User.findById(user._id)
            .populate("rooms")
            .select("rooms")
            .exec();
        return rooms;
    } catch (error) {
        throw error;
    }
};

export {
    registerUser,
    loginUser,
    loginGuest,
    logoutUser,
    updateAvatar,
    updateUserData,
    getRoomsByUser,
};

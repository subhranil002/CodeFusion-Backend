import constants from "../constants.js";
import { User } from "../models/index.js";
import forgotPasswordTemplate from "../templates/email/forgotPasswordTemplate.js";
import {
    ApiError,
    fileHandler,
    generateAccessAndRefreshToken,
} from "../utils/index.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import contactUsTemplate from "../templates/email/contactUsTemplate.js";
import passwordChangedTemplate from "../templates/email/passwordChangedTemplate.js";
import accountCreatedTemplate from "../templates/email/accountCreatedTemplate.js";

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

        sendEmail(
            user.email,
            "CodeFusion - Account created successfully",
            accountCreatedTemplate(user.fullName, user.email)
        );

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

const forgotPasswordService = async (user: any) => {
    try {
        const resetToken = crypto.randomBytes(20).toString("hex");
        const forgotPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
        await sendEmail(
            user.email,
            "CodeFusion - Password reset request",
            forgotPasswordTemplate(resetPasswordUrl, user.email)
        );
        await User.findByIdAndUpdate(user._id, {
            forgotPasswordToken,
            forgotPasswordExpiry,
        });
    } catch (error) {
        throw error;
    }
};

const resetPasswordService = async (resetToken: string, password: string) => {
    try {
        const forgotPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const user: any = await User.findOne({
            forgotPasswordToken,
            forgotPasswordExpiry: { $gt: Date.now() },
        });
        if (!user) {
            throw new ApiError("Token is invalid or expired", 400);
        }

        user.password = password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save();
        const mailMessage = passwordChangedTemplate(user.fullName, user.email);
        sendEmail(
            user.email,
            "CodeFusion - Password reset success",
            mailMessage
        );
    } catch (error) {
        throw error;
    }
};

const changePasswordService = async (
    user_id: any,
    oldPassword: string,
    newPassword: string
) => {
    try {
        const user: any = await User.findById(user_id).select("+password");
        if (!(await user.isPasswordCorrect(oldPassword))) {
            throw new ApiError("Incorrect credentials", 401);
        }

        user.password = newPassword;
        await user.save();
        const mailMessage = passwordChangedTemplate(user.fullName, user.email);
        sendEmail(
            user.email,
            "CodeFusion - Password changed successfully",
            mailMessage
        );
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

const contactUsService = async (
    name: string,
    email: string,
    message: string
) => {
    try {
        const mailMessage = contactUsTemplate(name, email, message);
        await sendEmail(
            constants.ADMIN_EMAIL,
            "CodeFusion - Contact Us",
            mailMessage
        );
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
    forgotPasswordService,
    resetPasswordService,
    changePasswordService,
    getRoomsByUser,
    contactUsService,
};

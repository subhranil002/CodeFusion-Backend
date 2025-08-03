import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import constants from "../constants.js";

interface IUser {
    fullName: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        secure_url: string;
    };
    roles: string;
    rooms: mongoose.Types.ObjectId[];
    refreshToken: string;
    forgotPasswordToken: string;
    forgotPasswordExpiry: Date;
}

interface IUserMethods {
    isPasswordCorrect(plainTextPassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser, {}, IUserMethods>(
    {
        fullName: {
            type: "String",
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: "String",
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            unique: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Invalid email address",
            ],
        },
        password: {
            type: "String",
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        avatar: {
            public_id: {
                type: "String",
            },
            secure_url: {
                type: "String",
            },
        },
        roles: {
            type: String,
            enum: ["ADMIN", "CODER", "GUEST"],
            default: "CODER",
        },
        rooms: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "rooms",
        },
        refreshToken: String,
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
    isPasswordCorrect: async function (plainTextPassword: string) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generateAccessToken: function () {
        const payload = { _id: this._id };
        const secret = constants.ACCESS_TOKEN_SECRET;
        const options: SignOptions = {
            expiresIn: constants.ACCESS_TOKEN_EXPIRE as any,
        };

        return jwt.sign(payload, secret, options);
    },
    generateRefreshToken: function () {
        const payload = { _id: this._id };
        const secret = constants.REFRESH_TOKEN_SECRET;
        const options: SignOptions = {
            expiresIn: constants.REFRESH_TOKEN_EXPIRE as any,
        };

        return jwt.sign(payload, secret, options);
    },
};

export type userDocument = IUser & Document & IUserMethods;
const User = model("users", userSchema);
export default User;

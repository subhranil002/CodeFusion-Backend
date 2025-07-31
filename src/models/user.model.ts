import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import constants from "../constants.js";

interface IUser {
    name: string;
    password: string;
}

interface IUserMethods {
    isPasswordCorrect(plainTextPassword: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
}

const userSchema = new Schema<IUser, {}, IUserMethods>(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
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
    generateAccessToken: async function () {
        return jwt.sign<any>(
            {
                _id: this._id,
            },
            constants.ACCESS_TOKEN_SECRET,
            {
                expiresIn: constants.ACCESS_TOKEN_EXPIRE,
            }
        );
    },
    generateRefreshToken: function () {
        return jwt.sign<any>(
            {
                _id: this._id,
            },
            constants.REFRESH_TOKEN_SECRET,
            {
                expiresIn: constants.REFRESH_TOKEN_EXPIRE,
            }
        );
    },
};

export type userDocument = IUser & Document & IUserMethods;
const User = model("users", userSchema);
export default User;

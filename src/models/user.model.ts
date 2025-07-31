import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import constants from "../constants.js";

interface IUser {
    name: string;
    password: string;
}

interface IUserMethods {
    isPasswordCorrect(plainTextPassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
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

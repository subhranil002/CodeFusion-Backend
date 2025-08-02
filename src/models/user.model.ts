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
    rooms: mongoose.Types.ObjectId[];
}

interface IUserMethods {
    isPasswordCorrect(plainTextPassword: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser, {}, IUserMethods>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            public_id: {
                type: String,
                required: true,
            },
            secure_url: {
                type: String,
                required: true,
            },
        },
        rooms: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "rooms",
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

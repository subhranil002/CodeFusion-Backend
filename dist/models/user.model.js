import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import constants from "../constants.js";
const userSchema = new Schema({
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
    role: {
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
    subscription: {
        id: {
            type: String,
            default: "",
        },
        plan: {
            type: String,
            enum: ["free", "basic", "pro"],
            default: "free",
        },
        status: {
            type: String,
            enum: [
                "created",
                "active",
                "cancelled",
                "completed",
                "expired",
            ],
            default: "completed",
        },
        expiresOn: {
            type: Date,
        },
    },
    codeExecutionCount: {
        type: Number,
        default: 0,
    },
    aiInteractionCount: {
        type: Number,
        default: 0,
    },
    countUpdateDate: {
        type: Date,
        default: new Date(),
    },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods = {
    isPasswordCorrect: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generateAccessToken: function () {
        const payload = { _id: this._id };
        const secret = constants.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: constants.ACCESS_TOKEN_EXPIRE,
        };
        return jwt.sign(payload, secret, options);
    },
    generateRefreshToken: function () {
        const payload = { _id: this._id };
        const secret = constants.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: constants.REFRESH_TOKEN_EXPIRE,
        };
        return jwt.sign(payload, secret, options);
    },
};
const User = model("users", userSchema);
export default User;

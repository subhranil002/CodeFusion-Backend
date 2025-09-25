import mongoose, { Schema, model } from "mongoose";
const roomSchema = new Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    roomName: {
        type: String,
        required: true,
    },
    language: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    code: {
        type: String,
        default: "/* Welcome to CodeFusion! */",
        select: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    anyoneCanEdit: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const Room = model("rooms", roomSchema);
export default Room;

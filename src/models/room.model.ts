import mongoose, { Document, Schema, model } from "mongoose";

interface IRoom {
    roomId: string;
    language: {
        id: string;
        name: string;
    };
    code: string;
    owner: mongoose.Types.ObjectId;
    public: boolean;
}

const roomSchema = new Schema<IRoom, {}, {}>(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
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
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        public: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export type roomDocument = IRoom & Document;
const Room = model("rooms", roomSchema);
export default Room;

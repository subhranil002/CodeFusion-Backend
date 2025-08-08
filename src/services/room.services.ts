import { Room, User } from "../models/index.js";
import { customAlphabet } from "nanoid";
import { ApiError } from "../utils/index.js";

const createRoomByUser = async (user: any, language: any) => {
    try {
        const alphabet =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const newRoomId = customAlphabet(alphabet, 6)();
        const isRoomExists: any = await Room.findOne({ roomId: newRoomId });
        if (isRoomExists) {
            throw new ApiError("Some error occurred", 500);
        }

        const room = await Room.create({
            roomId: newRoomId,
            language,
            owner: user._id,
        });

        await User.findByIdAndUpdate(
            user._id,
            {
                $push: {
                    rooms: room._id,
                },
            },
            { new: true }
        ).select("rooms");

        return room;
    } catch (error) {
        throw error;
    }
};

export { createRoomByUser };

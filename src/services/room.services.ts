import { Room, User } from "../models/index.js";
import { customAlphabet } from "nanoid";
import { ApiError } from "../utils/index.js";
import { judge0 } from "../configs/index.js";

const languageList = [
    { id: 110, name: "C" },
    { id: 105, name: "CPP" },
    { id: 107, name: "Go" },
    { id: 91, name: "Java" },
    { id: 102, name: "JavaScript" },
    { id: 111, name: "Kotlin" },
    { id: 98, name: "PHP" },
    { id: 109, name: "Python" },
    { id: 72, name: "Ruby" },
    { id: 108, name: "Rust" },
    { id: 46, name: "Shell" },
    { id: 101, name: "TypeScript" },
];

const runCode = async (code: string, langId: number, stdin = "") => {
    try {
        const payload = {
            source_code: code,
            language_id: langId,
            stdin,
            cpu_time_limit: "5",
            memory_limit: "128000",
        };

        const response = await judge0.post("/submissions", payload);

        while (true) {
            const result = await judge0.get(
                `/submissions/${response.data.token}`
            );

            if (result.data.status.id !== 1 && result.data.status.id !== 2) {
                return result.data;
            }

            await new Promise((r) => setTimeout(r, 500));
        }
    } catch (error: any) {
        throw new ApiError(error, 422);
    }
};

const checkRoomExists = async (roomId: string) => {
    try {
        const isRoomExists = await Room.findOne({ roomId });
        if (isRoomExists) {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
};

const createRoomByUser = async (
    user: any,
    roomName: string,
    languageId: string,
    languageName: string
) => {
    try {
        const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const newRoomId = customAlphabet(alphabet, 6)();
        if (await checkRoomExists(newRoomId)) {
            throw new ApiError("Some error occurred", 500);
        }

        const room = await Room.create({
            roomId: newRoomId,
            roomName,
            language: {
                id: languageId,
                name: languageName,
            },
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

const updateRoomData = async (
    user: any,
    roomId: string,
    roomName: string,
    code: string
) => {
    try {
        const isRoomExists = await Room.findOne({ roomId });
        if (!isRoomExists) {
            throw new ApiError("Room not found", 404);
        }

        if (!isRoomExists.owner.equals(user._id)) {
            throw new ApiError(
                "You are not authorized to update this room",
                403
            );
        }

        const room = await Room.findByIdAndUpdate(
            isRoomExists._id,
            {
                roomName,
                code,
            },
            { new: true }
        );

        return room;
    } catch (error) {
        throw error;
    }
};

export {
    languageList,
    runCode,
    checkRoomExists,
    createRoomByUser,
    updateRoomData,
};

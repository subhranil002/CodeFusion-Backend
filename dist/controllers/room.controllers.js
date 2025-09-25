import { languageList, runCode, createRoomByUser, updateRoomData, joinRoomByRoomId, deleteRoomByRoomId, } from "../services/room.services.js";
import { getRoomsByUser } from "../services/user.services.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
const getLanguages = asyncHandler(async (req, res, next) => {
    try {
        return res
            .status(200)
            .json(new ApiResponse("Languages retrieved successfully", languageList));
    }
    catch (error) {
        return next(new ApiError(`editor.controller :: getLanguages: ${error}`, error.statusCode || 500));
    }
});
const codeRunner = asyncHandler(async (req, res, next) => {
    try {
        const { code, langId, stdIn } = req.body;
        if (!code || !langId) {
            throw new ApiError("All fields are required", 400);
        }
        req.user.codeExecutionCount++;
        req.user.save();
        const result = await runCode(code, langId, stdIn);
        return res
            .status(200)
            .json(new ApiResponse("Code executed successfully", result));
    }
    catch (error) {
        return next(new ApiError(`editor.controller :: codeRunner: ${error}`, error.statusCode || 500));
    }
});
const joinRoom = asyncHandler(async (req, res, next) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            throw new ApiError("Room id is required", 400);
        }
        const room = await joinRoomByRoomId(req.user, roomId);
        return res
            .status(200)
            .json(new ApiResponse("Room joined successfully", room));
    }
    catch (error) {
        return next(new ApiError(`user.controller :: joinRoom: ${error}`, error.statusCode || 500));
    }
});
const createRoom = asyncHandler(async (req, res, next) => {
    try {
        const { roomName, languageId, languageName } = req.body;
        if (!roomName || !languageId || !languageName) {
            throw new ApiError("All fields are required", 400);
        }
        const rooms = await getRoomsByUser(req.user);
        const isRoomExists = rooms.rooms.some((room) => room.roomName === roomName);
        if (isRoomExists) {
            throw new ApiError("Room already exists", 400);
        }
        const room = await createRoomByUser(req.user, roomName, languageId, languageName);
        return res
            .status(201)
            .json(new ApiResponse("Room created successfully", room));
    }
    catch (error) {
        return next(new ApiError(`user.controller :: createRoom: ${error}`, error.statusCode || 500));
    }
});
const updateRoom = asyncHandler(async (req, res, next) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            throw new ApiError("Room id is required", 400);
        }
        const { roomName, code, anyoneCanEdit } = req.body;
        const updatedRoomData = await updateRoomData(req.user, roomId, roomName, code, anyoneCanEdit);
        return res
            .status(200)
            .json(new ApiResponse("Room updated successfully", updatedRoomData));
    }
    catch (error) {
        return next(new ApiError(`user.controller :: updateRoom: ${error}`, error.statusCode || 500));
    }
});
const deleteRoom = asyncHandler(async (req, res, next) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            throw new ApiError("Room id is required", 400);
        }
        await deleteRoomByRoomId(req.user, roomId);
        return res
            .status(200)
            .json(new ApiResponse("Room deleted successfully"));
    }
    catch (error) {
        return next(new ApiError(`user.controller :: deleteRoom: ${error}`, error.statusCode || 500));
    }
});
export { getLanguages, codeRunner, createRoom, updateRoom, joinRoom, deleteRoom, };

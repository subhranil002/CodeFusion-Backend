import { createRoomByUser } from "../services/room.services.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const createRoom = asyncHandler(async (req: any, res, next) => {
    try {
        const { languageId, languageName } = req.body;
        if (!languageId || !languageName) {
            throw new ApiError("All fields are required", 400);
        }

        const room: any = await createRoomByUser(req.user, {
            id: languageId,
            name: languageName,
        });

        return res
            .status(201)
            .json(new ApiResponse("Room created successfully", room));
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: createRoom: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

export { createRoom };

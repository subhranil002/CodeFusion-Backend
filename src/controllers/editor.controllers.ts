import { languageList, runCode } from "../services/editor.services.js";
import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

export const getLanguages = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        "Languages retrieved successfully",
                        languageList
                    )
                );
        } catch (error: any) {
            return next(
                new ApiError(
                    `editor.controller :: getLanguages :: ${error}`,
                    error.statusCode || 500
                )
            );
        }
    }
);

export const codeRunner = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code, langId, stdIn } = req.body;

            if (!code || !langId) {
                throw new ApiError("All fields are required", 400);
            }

            const result = await runCode(code, langId, stdIn);

            return res
                .status(200)
                .json(new ApiResponse("Code executed successfully", result));
        } catch (error: any) {
            return next(
                new ApiError(
                    `editor.controller :: codeRunner :: ${error}`,
                    error.statusCode || 500
                )
            );
        }
    }
);

import { runCode } from "../services/code-executer.services.js";
import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

export const getLanguages = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
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
            ]

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
                    `code-executer.controller :: getLanguages :: ${error}`,
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
                    `code-executer.controller :: codeRunner :: ${error}`,
                    error.statusCode || 500
                )
            );
        }
    }
);

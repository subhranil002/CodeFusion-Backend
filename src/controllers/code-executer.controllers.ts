import { runCode } from "../services/code-executer.services.js";
import { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../utils/index.js";

export const getLanguages = asyncHandler(
    async (req: Request, res: Response) => {
        const langIdMap: { [key: string]: number } = {
            bash: 46, // Bash (5.0.0)
            c: 110, // C (Clang 19.1.7)
            csharp: 51, // C# (Mono 6.6.0.161)
            cpp: 105, // C++ (GCC 14.1.0)
            go: 107, // Go (1.23.5)
            java: 91, // Java (JDK 17.0.6)
            javascript: 102, // JavaScript (Node.js 22.08.0)
            kotlin: 111, // Kotlin (2.1.10)
            php: 98, // PHP (8.3.11)
            python: 109, // Python (3.13.2)
            r: 99, // R (4.4.1)
            ruby: 72, // Ruby (2.7.0)
            rust: 108, // Rust (1.85.0)
            sql: 82, // SQL (SQLite 3.27.2)
            typescript: 101, // TypeScript (5.6.2)
        };

        return res
            .status(200)
            .json(
                new ApiResponse("Languages retrieved successfully", langIdMap)
            );
    }
);

// export const codeRunner = asyncHandler(async (req: Request, res: Response) => {
//     const { code, langId } = req.body;

//     if (!code || !langId) {
//         return res.status(400).json(new ApiResponse("All fields are required"));
//     }

//     const result = await runCode(code, langId);
// });

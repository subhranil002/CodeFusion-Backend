import { judge0 } from "../configs/index.js";
import { ApiError } from "../utils/index.js";

export const languageList = [
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

export async function runCode(code: string, langId: number, stdin = "") {
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
}

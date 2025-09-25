import judge0 from "../configs/judge0.config.js";
async function submitCode(sourceCode, languageId, stdin = "") {
    const payload = {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        cpu_time_limit: "5",
        memory_limit: "128000",
    };
    const res = await judge0.post("/submissions", payload);
    return res.data.token;
}
async function getResult(token) {
    while (true) {
        const res = await judge0.get(`/submissions/${token}`);
        if (res.data.status.id !== 1 && res.data.status.id !== 2) {
            return res.data;
        }
        await new Promise((r) => setTimeout(r, 500));
    }
}
export async function runCode(code, langId, stdin = "") {
    const token = await submitCode(code, langId, stdin);
    return await getResult(token);
}

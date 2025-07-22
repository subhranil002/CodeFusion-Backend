import judge0 from "../configs/judge0.config.js";

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

async function submitCode(sourceCode: string, languageId: number, stdin = "") {
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

async function getResult(token: string) {
    while (true) {
        const res = await judge0.get(`/submissions/${token}`);

        if (res.data.status.id !== 1 && res.data.status.id !== 2) {
            console.log(res.data);
            return res.data;
        }

        await new Promise((r) => setTimeout(r, 500));
    }
}

export async function runCode(code: string, lang: string, stdin = "") {
    const langId = langIdMap[lang];
    const token = await submitCode(code, langId, stdin);
    return await getResult(token);
}

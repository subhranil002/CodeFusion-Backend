import express from "express";
const app = express();
import { runCode } from "./services/codeexecuter.services.js";

// runCode("console.log('Hello World!')", "typescript");

app.use(express.json());

app.get("/", (req, res) => {
    return res
        .status(200)
        .json({
            success: true,
            message: "Up and running!",
        })
});

export default app;

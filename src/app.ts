import express from "express";
const app = express();
import appRouter from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";
import constants from "./constants.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Middlewares
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    cors({
        origin: constants.FRONTEND_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));

// Routes
app.use("/api", appRouter);
app.all(/./, (req, res) => {
    res.status(404).json({
        success: false,
        message: "Page not found",
    });
});
app.use(errorMiddleware);

export default app;

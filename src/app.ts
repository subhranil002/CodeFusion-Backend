import express from "express";
const app = express();
import appRouter from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";
import constants from "./constants.js";
import morgan from "morgan";

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
    })
);
app.use(morgan("dev"));

// Routes
app.use("/api", appRouter);
app.use(errorMiddleware);

export default app;

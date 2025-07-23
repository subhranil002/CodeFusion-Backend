import dotenv from "dotenv";
dotenv.config();

export default {
    PORT: process.env.PORT!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    NODE_ENV: process.env.NODE_ENV!,
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY!,
}
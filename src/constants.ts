import dotenv from "dotenv";
dotenv.config();

export default {
    PORT: process.env.PORT!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
}
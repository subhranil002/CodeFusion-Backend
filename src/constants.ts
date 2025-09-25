import dotenv from "dotenv";
dotenv.config();

export default {
    PORT: process.env.PORT!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    NODE_ENV: process.env.NODE_ENV!,
    MONGO_URI: process.env.MONGO_URI!,
    DB_NAME: process.env.DB_NAME!,
    GUEST_ID: process.env.GUEST_ID!,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE!,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY!,
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER!,
    CLOUDINARY_IMAGE_MODERATION: process.env.CLOUDINARY_IMAGE_MODERATION!,
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY!,
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_USERNAME: process.env.SMTP_USERNAME!,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
};

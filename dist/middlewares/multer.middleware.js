import path from "path";
import multer from "multer";
import { ApiError } from "../utils/index.js";
const upload = multer({
    dest: "./public/temp",
    limits: { fileSize: 5 * 1024 * 1024 },
    storage: multer.diskStorage({
        destination: "./public/temp",
        filename: (_req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png") {
            cb(new ApiError(`Invalid file type: ${ext}`, 400), false);
            return;
        }
        cb(null, true);
    },
});
export default upload;

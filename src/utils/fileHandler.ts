import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import constants from "../constants.js";
import { ApiError } from "../utils/index.js";
import path from "path";
import { fileURLToPath } from "url";

const deleteLocalFiles = async () => {
    try {
        const tempDir = path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../../public/temp"
        );

        if (fs.existsSync(tempDir)) {
            const files = await fs.promises.readdir(tempDir);

            await Promise.all(
                files.map(async (file) => {
                    if (file !== ".gitkeep") {
                        const filePath = path.join(tempDir, file);
                        await fs.promises.unlink(filePath);
                    }
                })
            );
        }
    } catch (error) {
        throw new ApiError("Error while deleting local files", 500);
    }
};

const uploadImageToCloud = async (localFilePath: string) => {
    if (!localFilePath) return null;

    try {
        const response: any = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image",
            moderation: constants.CLOUDINARY_IMAGE_MODERATION,
        });

        await deleteLocalFiles();

        if (
            response?.moderation?.length > 0 &&
            response?.moderation[0]?.status === "rejected"
        ) {
            throw new ApiError(
                "This image is not safe to upload, please upload a different image",
                400
            );
        }

        return {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };
    } catch (error: any) {
        await deleteLocalFiles();
        throw new ApiError(error.message, 500);
    }
};

const deleteCloudFile = async (public_id: string) => {
    try {
        if (!public_id) return true;

        await cloudinary.uploader.destroy(public_id, {
            resource_type: "image",
        });

        return true;
    } catch (error: any) {
        throw new ApiError(error, 500);
    }
};

const fileHandler = {
    deleteLocalFiles,
    uploadImageToCloud,
    deleteCloudFile,
};

export default fileHandler;

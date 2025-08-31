import constants from "../constants.js";
import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Get error details
    let { statusCode, message, stack } = err;

    if (constants.NODE_ENV === "development") {
        console.log("ErrorMiddleware: ", err);

        // Send error response
        return res.status(statusCode || 500).json({
            success: false,
            message: message || "Something went wrong",
            stack: stack || "",
        });
    }

    // Capture the error message part only
    const match = message.match(/[^:]+$/);
    let errorMessage;
    if (match) {
        errorMessage = match[0].trim();
    } else {
        let parts = message.split("::");
        console.log(parts);
        errorMessage = parts[parts.length - 1].trim();
    }

    // Send error response
    return res.status(statusCode || 500).json({
        success: false,
        message: errorMessage || "Something went wrong",
    });
};

export default errorMiddleware;

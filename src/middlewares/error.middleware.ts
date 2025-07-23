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
    const errorPattern = / Error: (.*)/;
    const match = message.match(errorPattern);
    if (match && match[1]) {
        message = match[1].trim();
    } else {
        let parts = message.split("::");
        console.log(parts);
        message = parts[parts.length - 1].trim();
    }

    // Send error response
    return res.status(statusCode || 500).json({
        success: false,
        message: message || "Something went wrong",
    });
};

export default errorMiddleware;

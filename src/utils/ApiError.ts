class ApiError extends Error {
    statusCode: number;
    data: any;

    constructor(message: string, statusCode: number) {
        super(message || "Something went wrong");
        this.statusCode = Number(statusCode) || 500;
        this.data = null;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
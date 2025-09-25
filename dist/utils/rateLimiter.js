import rateLimit from "express-rate-limit";
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: "Too many requests, please try again later.",
        data: {},
    },
});
export default limiter;

import ApiError from "../utils/ApiError.js";

const checkCodeExecutionLimits = async (req: any, res: any, next: any) => {
    if (req?.user?.role === "ADMIN") return next();

    if (req?.user?.subscription?.status === "active") {
        if (
            req.user.subscription.plan === "basic" &&
            req.user.codeExecutionCount >= 50
        ) {
            return next(
                new ApiError("You have reached your limit for today", 403)
            );
        }
    } else {
        if (req.user.codeExecutionCount >= 10) {
            return next(
                new ApiError("You have reached your limit for today", 403)
            );
        }
    }

    next();
};

const checkAiInteractionLimits = async (req: any, res: any, next: any) => {
    if (req?.user?.role === "ADMIN") return next();

    if (req?.user?.subscription?.status === "active") {
        if (
            req.user.subscription.plan === "basic" &&
            req.user.aiInteractionCount >= 25
        ) {
            return next(
                new ApiError("You have reached your limit for today", 403)
            );
        }
    } else {
        if (req.user.aiInteractionCount >= 5) {
            return next(
                new ApiError("You have reached your limit for today", 403)
            );
        }
    }

    next();
};

const checkRoomLimits = async (req: any, res: any, next: any) => {
    if (req?.user?.role === "ADMIN") return next();

    if (
        req?.user?.subscription?.status !== "active" &&
        req.user.rooms.length >= 5
    ) {
        return next(
            new ApiError("You can only create 5 rooms in free plan", 403)
        );
    }

    next();
};

export { checkRoomLimits, checkCodeExecutionLimits, checkAiInteractionLimits };

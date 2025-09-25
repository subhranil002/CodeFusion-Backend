import { isToday } from "date-fns";
import ApiError from "../utils/ApiError.js";

const resetLimits = async (req: any) => {
    if (!isToday(req?.user?.countUpdateDate)) {
        req.user.countUpdateDate = new Date();
        req.user.codeExecutionCount = 0;
        req.user.aiInteractionCount = 0;
        await req.user.save();
    }
};

const checkCodeExecutionLimits = async (req: any, res: any, next: any) => {
    await resetLimits(req);

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
    await resetLimits(req);

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
    if (
        req?.user?.subscription?.status !== "active" &&
        req.user.rooms.length === 5
    ) {
        return next(
            new ApiError("You can only create 5 rooms in free plan", 403)
        );
    }

    next();
};

export { checkRoomLimits, checkCodeExecutionLimits, checkAiInteractionLimits };

import razorpayInstance from "../configs/razorpay.config.js";
import constants from "../constants.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import {
    buyBasicSubscriptionService,
    buyProSubscriptionService,
    cancelSubscriptionService,
    getAllPaymentsService,
    getPaymentHistoryService,
    verifySubscriptionService,
} from "../services/payment.services.js";

const getRazorpayApiKey = asyncHandler(async (req, res, next) => {
    res.status(200).json(
        new ApiResponse("Api key fetched successfully", {
            key: constants.RAZORPAY_KEY_ID,
        })
    );
});

const buyBasicSubscription = asyncHandler(async (req: any, res, next) => {
    try {
        if (
            req.user.subscription.status === "active" &&
            (req.user.subscription.plan === "basic" ||
                req.user.subscription.plan === "pro")
        ) {
            throw new ApiError("User already has an active subscription", 400);
        }

        const subscription = await buyBasicSubscriptionService(req.user);

        res.status(200).json(
            new ApiResponse("Subscription created successfully", subscription)
        );
    } catch (error: any) {
        return next(
            new ApiError(
                `payment.controller :: buyBasicSubscription: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const buyProSubscription = asyncHandler(async (req: any, res, next) => {
    try {
        if (
            req.user.subscription.status === "active" &&
            req.user.subscription.plan === "pro"
        ) {
            throw new ApiError("User already has an active subscription", 400);
        }

        const subscription = await buyProSubscriptionService(req.user);

        res.status(200).json(
            new ApiResponse("Subscription created successfully", subscription)
        );
    } catch (error: any) {
        return next(
            new ApiError(
                `payment.controller :: buyProSubscription: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const verifySubscription = asyncHandler(async (req: any, res, next) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature,
            amount,
            plan,
        } = req.body;
        if (
            !razorpay_payment_id ||
            !razorpay_subscription_id ||
            !razorpay_signature ||
            !amount
        ) {
            throw new ApiError("All fields are required", 400);
        }

        await verifySubscriptionService(
            req.user,
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature,
            amount,
            plan
        );

        res.status(200).json(
            new ApiResponse("Subscription verified successfully")
        );
    } catch (error: any) {
        return next(
            new ApiError(
                `payment.controller :: verifySubscription: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const cancelSubscription = asyncHandler(async (req: any, res, next) => {
    try {
        if (req.user.subscription.status !== "active") {
            throw new ApiError("User don't have a subscription", 400);
        }

        await cancelSubscriptionService(req.user);

        res.status(200).json(
            new ApiResponse("Subscription cancelled successfully")
        );
    } catch (error: any) {
        return next(
            new ApiError(
                `payment.controller :: cancelSubscription: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const getAllPayments = asyncHandler(async (req, res, next) => {
    try {
        const { start, limit } = req.body;
        if (!start || start < 0) {
            throw new ApiError("Start must be a positive number", 400);
        }
        if (!limit || limit <= 0) {
            throw new ApiError("Limit must be a positive number", 400);
        }

        const { total, purchases } = await getAllPaymentsService(start, limit);

        res.status(200).json(
            new ApiResponse("All payments fetched successfully", {
                start,
                limit,
                total,
                purchases,
            })
        );
    } catch (error: any) {
        return next(
            new ApiError(
                `payment.controller :: allPayments: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

const getPaymentHistory = asyncHandler(async (req: any, res, next) => {
    try {
        const purchases = await getPaymentHistoryService(req.user);

        if (!purchases || purchases.length === 0) {
            return res
                .status(200)
                .json(new ApiResponse("You have not made any purchase yet"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse("My Purchases fetched successfully", purchases)
            );
    } catch (error: any) {
        return next(
            new ApiError(
                `user.controller :: getPaymentHistory: ${error}`,
                error.statusCode || 500
            )
        );
    }
});

export {
    getRazorpayApiKey,
    buyBasicSubscription,
    buyProSubscription,
    verifySubscription,
    cancelSubscription,
    getAllPayments,
    getPaymentHistory,
};

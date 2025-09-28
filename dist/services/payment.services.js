import Payment from "../models/payment.model.js";
import razorpayInstance from "../configs/razorpay.config.js";
import constants from "../constants.js";
import crypto from "crypto";
import { addMonths } from "date-fns";
import { ApiError } from "../utils/index.js";
const buyBasicSubscriptionService = async (user) => {
    try {
        const subscription = await razorpayInstance.subscriptions.create({
            plan_id: constants.RAZORPAY_PLAN_ID_BASIC,
            customer_notify: 1,
            total_count: 12,
        });
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();
        return subscription;
    }
    catch (error) {
        throw error;
    }
};
const buyProSubscriptionService = async (user) => {
    try {
        const subscription = await razorpayInstance.subscriptions.create({
            plan_id: constants.RAZORPAY_PLAN_ID_PRO,
            customer_notify: 1,
            total_count: 12,
        });
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();
        return subscription;
    }
    catch (error) {
        throw error;
    }
};
const verifySubscriptionService = async (user, razorpay_payment_id, razorpay_signature, amount) => {
    try {
        const generatedSignature = crypto
            .createHmac("sha256", constants.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${user.subscription.id}`)
            .digest("hex");
        if (generatedSignature !== razorpay_signature) {
            throw new ApiError("Payment not verified, please try again", 400);
        }
        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id: user.subscription.id,
            razorpay_signature,
            amount,
            purchasedBy: user._id,
            status: "completed",
        });
        user.subscription.status = "active";
        const expiryDate = addMonths(new Date(), 1);
        user.subscription.expiresOn = expiryDate;
        await user.save();
    }
    catch (error) {
        throw error;
    }
};
const getPaymentHistoryService = async (user) => {
    try {
        const purchases = await Payment.aggregate([
            {
                $match: {
                    purchasedBy: user._id,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);
        return purchases;
    }
    catch (error) {
        throw error;
    }
};
export { buyBasicSubscriptionService, buyProSubscriptionService, verifySubscriptionService, getPaymentHistoryService, };

import Payment from "../models/payment.model.js";
import razorpayInstance from "../configs/razorpay.config.js";
import constants from "../constants.js";
import crypto from "crypto";
import { addMonths } from "date-fns";
import { ApiError } from "../utils/index.js";
import paymentSuccessTemplate from "../templates/email/paymentSuccessTemplate.js";
import sendMail from "../utils/sendEmail.js";

const buyBasicSubscriptionService = async (user: any) => {
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
    } catch (error) {
        throw error;
    }
};

const buyProSubscriptionService = async (user: any) => {
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
    } catch (error) {
        throw error;
    }
};

const verifySubscriptionService = async (
    user: any,
    razorpay_payment_id: string,
    razorpay_signature: string,
    amount: number,
    plan: string
) => {
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
        user.subscription.plan = plan;
        const expiryDate = addMonths(new Date(), 1);
        user.subscription.expiresOn = expiryDate;
        await user.save();

        const messageHtml = paymentSuccessTemplate(user.email, plan, amount);
        sendMail(user.email, "Payment Successful", messageHtml);
    } catch (error) {
        throw error;
    }
};

const cancelSubscriptionService = async (user: any) => {
    try {
        await razorpayInstance.subscriptions.cancel(user.subscription.id);

        await Payment.updateOne(
            {
                razorpay_subscription_id: user.subscription.id,
            },
            {
                status: "cancelled",
            }
        );

        user.subscription.id = null;
        user.subscription.status = "cancelled";
        user.subscription.plan = "free";
        user.subscription.expiresOn = null;
        await user.save();
    } catch (error) {
        throw error;
    }
};

const getPaymentHistoryService = async (user: any) => {
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
    } catch (error) {
        throw error;
    }
};

export {
    buyBasicSubscriptionService,
    buyProSubscriptionService,
    verifySubscriptionService,
    cancelSubscriptionService,
    getPaymentHistoryService,
};

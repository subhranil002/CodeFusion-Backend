import Payment from "../models/payment.model.js";
import razorpayInstance from "../configs/razorpay.config.js";
import constants from "../constants.js";
import crypto from "crypto";
import { addMonths, isBefore } from "date-fns";
import { ApiError } from "../utils/index.js";
import paymentSuccessTemplate from "../templates/email/paymentSuccessTemplate.js";
import sendMail from "../utils/sendEmail.js";
import cancelSubscriptionTemplate from "../templates/email/cancelSubscriptionTemplate.js";

const buyBasicSubscriptionService = async (user: any) => {
    try {
        const subscription = await razorpayInstance.subscriptions.create({
            plan_id: constants.RAZORPAY_PLAN_ID_BASIC,
            customer_notify: 1,
            total_count: 12,
        });

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

        return subscription;
    } catch (error) {
        throw error;
    }
};

const verifySubscriptionService = async (
    user: any,
    razorpay_payment_id: string,
    razorpay_subscription_id: string,
    razorpay_signature: string,
    amount: number,
    plan: string
) => {
    try {
        const generatedSignature = crypto
            .createHmac("sha256", constants.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            throw new ApiError("Payment not verified, please try again", 400);
        }

        if (
            plan === "pro" &&
            user.subscription.plan === "basic" &&
            !isBefore(user.subscription.expiresOn, new Date())
        ) {
            await razorpayInstance.subscriptions.cancel(user.subscription.id);
            await Payment.updateOne(
                {
                    razorpay_subscription_id: user.subscription.id,
                },
                {
                    status: "cancelled",
                }
            );
        }

        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id: razorpay_subscription_id,
            razorpay_signature,
            amount,
            purchasedBy: user._id,
            status: "completed",
        });

        user.subscription.id = razorpay_subscription_id;
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

        const messageHtml = cancelSubscriptionTemplate(
            user.fullName,
            user.email,
            user.subscription.plan,
            user.subscription.expiresOn
        );
        sendMail(user.email, "Subscription Cancelled", messageHtml);

        user.subscription.id = null;
        user.subscription.status = "cancelled";
        user.subscription.plan = "free";
        user.subscription.expiresOn = null;
        await user.save();
    } catch (error) {
        throw error;
    }
};

const getAllPaymentsService = async (start: string, limit: string) => {
    try {
        const [total, purchases] = await Promise.all([
            Payment.countDocuments().exec(),
            Payment.find()
                .sort({ createdAt: -1 })
                .skip(Number(start))
                .limit(Number(limit))
                .populate({ path: "purchasedBy", select: "fullName email" })
                .exec(),
        ]);

        return { total, purchases };
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
    getAllPaymentsService,
    getPaymentHistoryService,
};

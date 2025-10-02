import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
    razorpay_payment_id: string;
    razorpay_subscription_id?: string;
    razorpay_signature: string;
    amount: number;
    purchasedBy: Types.ObjectId;
    status: "completed" | "cancelled";
}

const paymentSchema = new Schema<IPayment>(
    {
        razorpay_payment_id: {
            type: String,
            required: true,
        },
        razorpay_subscription_id: {
            type: String,
        },
        razorpay_signature: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        purchasedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        status: {
            type: String,
            enum: ["created", "completed", "cancelled"],
        },
    },
    {
        timestamps: true,
    }
);

const Payment = model<IPayment>("payments", paymentSchema);

export default Payment;

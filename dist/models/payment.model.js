import { Schema, model } from "mongoose";
const paymentSchema = new Schema({
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
}, {
    timestamps: true,
});
const Payment = model("payments", paymentSchema);
export default Payment;

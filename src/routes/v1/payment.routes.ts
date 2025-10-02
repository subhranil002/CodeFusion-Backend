import { Router } from "express";
import {
    authorizedRoles,
    isLoggedIn,
} from "../../middlewares/auth.middleware.js";
import {
    buyBasicSubscription,
    buyProSubscription,
    cancelSubscription,
    getAllPayments,
    getPaymentHistory,
    getRazorpayApiKey,
    verifySubscription,
} from "../../controllers/payment.controllers.js";

const router = Router();

router.get("/apikey", isLoggedIn, getRazorpayApiKey);
router.get(
    "/buy/basic",
    isLoggedIn,
    authorizedRoles(["GUEST", "CODER"]),
    buyBasicSubscription
);
router.get(
    "/buy/pro",
    isLoggedIn,
    authorizedRoles(["GUEST", "CODER"]),
    buyProSubscription
);
router.post(
    "/verify",
    isLoggedIn,
    authorizedRoles(["GUEST", "CODER"]),
    verifySubscription
);
router.get(
    "/cancel",
    isLoggedIn,
    authorizedRoles(["GUEST", "CODER"]),
    cancelSubscription
);
router.post("/all", isLoggedIn, authorizedRoles(["ADMIN"]), getAllPayments);
router.get(
    "/history",
    isLoggedIn,
    authorizedRoles(["GUEST", "CODER"]),
    getPaymentHistory
);

export default router;

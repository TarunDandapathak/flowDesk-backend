import express from "express";
import authControllers from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/user/register",authControllers.registerUser);
router.post("/user/login", authControllers.loginUser);
// router.post("/user/refreshToken", authControllers.refreshToken);
router.get("/user/logout",authControllers.logoutUser);

router.post("/user/otp-verify",authControllers.otpVerification)

export default router;
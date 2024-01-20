import express from "express";
import authController from "../controllers/authController";
import verificationController from "../controllers/verificationController";

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/verify/:token", verificationController.verifyEmail);

export default router;

import express from "express";
import authController from "../controllers/authController";
import verificationController from "../controllers/verificationController";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/me", authenticateToken, authController.getUserDetail);
router.get("/verify", authenticateToken, verificationController.getVerifyEmail);
router.get("/verify/:token", verificationController.verifyEmail);       

export default router;

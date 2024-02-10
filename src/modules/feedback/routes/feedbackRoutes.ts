import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import feedbackController from "../controllers/feedbackController";

const router = express();

router.post("/add-feedback", authenticateToken, feedbackController.addFeedBack);

export default router;

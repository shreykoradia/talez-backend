import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import feedbackController from "../controllers/feedbackController";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";

const router = express();

router.post("/add-feedback", authenticateToken, feedbackController.addFeedBack);
router.get(
  "/get-feedback",
  authenticateToken,
  paginateMiddleWare,
  feedbackController.getFeedbacks
);

export default router;

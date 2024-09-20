import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import feedbackController from "../controllers/feedbackController";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { roles } from "../../../shared/constants";

const router = express();

router.post(
  "/add-feedback",
  authenticateToken,
  checkRole(roles),
  feedbackController.addFeedBack
);
router.get(
  "/get-feedbacks",
  authenticateToken,
  checkRole(roles),
  paginateMiddleWare,
  feedbackController.getFeedbacks
);
router.get(
  "/get-feedback",
  authenticateToken,
  checkRole(roles),
  feedbackController.getFeedbackById
);

export default router;

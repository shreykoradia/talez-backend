import express from "express";
import reactionController from "../controllers/reactionController";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { roles } from "../../../shared/constants";

const router = express();

router.post(
  "/upvote",
  authenticateToken,
  checkRole(roles),
  reactionController.upvote
);
router.post(
  "/downvote",
  authenticateToken,
  checkRole(roles),
  reactionController.downvote
);
router.get(
  "/reactions-count",
  authenticateToken,
  checkRole(roles),
  reactionController.countReaction
);
router.get(
  "/reaction-type",
  authenticateToken,
  checkRole(roles),
  reactionController.voteByFeedbackId
);
export default router;

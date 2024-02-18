import express from "express";
import reactionController from "../controllers/reactionController";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";

const router = express();

router.post("/upvote", authenticateToken, reactionController.upvote);
router.post("/downvote", authenticateToken, reactionController.downvote);
router.get("/reactions", authenticateToken, reactionController.countReaction);

export default router;

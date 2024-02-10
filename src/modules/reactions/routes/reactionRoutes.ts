import express from "express";
import reactionController from "../controllers/reactionController";

const router = express();

router.post("/upvote", reactionController.upvote);
router.post("/downvote", reactionController.downvote);

export default router;

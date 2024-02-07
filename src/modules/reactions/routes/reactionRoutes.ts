import express from "express";
import reactionController from "../controllers/reactionController";

const router = express();

router.use("/upvote", reactionController.upvote);
router.use("/downvote", reactionController.downvote);

export default router;

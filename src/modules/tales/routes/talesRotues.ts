import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import talesController from "../controllers/talesController";

const router = express();

router.post("/create-tales", authenticateToken, talesController.createTales);
router.post("/add-feedback", authenticateToken, talesController.addFeedBack);
// router.post("/add-upvote", authenticateToken, talesController.addReactions);
// router.post("/add-downvote", authenticateToken, talesController.addReactions);

// TODO API's

// router.use("/get-tales", authenticateToken, talesController.getTales);
// router.use("/get-feedback", authenticateToken, talesController.getFeedback);
// router.use("/get-reactions", authenticateToken, talesController.getReactions);

export default router;

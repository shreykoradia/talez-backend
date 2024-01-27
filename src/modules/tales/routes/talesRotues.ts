import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";

const router = express();

router.use("/create-tales", authenticateToken, talesController.createTales);
router.use("/get-tales", authenticateToken, talesController.getTales);
router.use("/add-feedback", authenticateToken, talesController.addFeedback);
router.use("/get-feedback", authenticateToken, talesController.getFeedback);
router.use("/add-comments", authenticateToken, talesController.addComments);
router.use("/get-comments", authenticateToken, talesController.getComments);
router.use("/add-reactions", authenticateToken, talesController.addReactions);
router.use("/get-reactions", authenticateToken, talesController.getReactions);

export default router;

import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import workFlowControllers from "../controllers/workFlowControllers";

const router = express.Router();

router.post(
  "/create-workflow",
  authenticateToken,
  workFlowControllers.createWorkFlow
);
export default router;

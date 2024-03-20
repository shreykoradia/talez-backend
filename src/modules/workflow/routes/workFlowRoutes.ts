import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import workFlowControllers from "../controllers/workFlowControllers";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";

const router = express.Router();

router.post(
  "/create-workflow",
  authenticateToken,
  workFlowControllers.createWorkFlow
);
router.get(
  "/get-workflows",
  authenticateToken,
  paginateMiddleWare,
  workFlowControllers.getAllWorkFlows
);
router.get(
  "/get-workflowbyid/:workflowId",
  authenticateToken,
  workFlowControllers.getWorkflowById
);

export default router;

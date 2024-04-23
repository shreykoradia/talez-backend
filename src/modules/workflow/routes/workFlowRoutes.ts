import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import workFlowControllers from "../controllers/workFlowControllers";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { roles } from "../../../shared/constants";

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
  "/get-workflow",
  authenticateToken,
  checkRole(roles),
  workFlowControllers.getWorkflowById
);

export default router;

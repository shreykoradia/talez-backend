import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { create_roles, roles } from "../../../shared/constants";
import issueController from "../controllers/issueController";

const router = express();

router.get(
  "/create-issue",
  authenticateToken,
  checkRole(create_roles),
  issueController.createIssue
);

// router.get(
//   "/get-issue",
//   authenticateToken,
//   checkRole(roles) //  get createIssueController Function
// );

export default router;

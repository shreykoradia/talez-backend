import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import talesController from "../controllers/talesController";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { create_roles, roles } from "../../../shared/constants";

const router = express();

router.post(
  "/create-tales",
  authenticateToken,
  checkRole(create_roles),
  talesController.createTales
);
router.get(
  "/get-tales",
  authenticateToken,
  checkRole(roles),
  paginateMiddleWare,
  talesController.getTales
);
router.get(
  "/get-tale",
  authenticateToken,
  checkRole(roles),
  talesController.getTaleById
);
router.get(
  "/edit-tale",
  authenticateToken,
  checkRole(roles),
  talesController.editTaleById
);
export default router;

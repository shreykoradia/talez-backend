import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { access_roles, roles } from "../../../shared/constants";
import linkController from "../controllers/linkController";

const router = express();

router.get("/links", authenticateToken, checkRole(roles));

router.post(
  "/links",
  authenticateToken,
  checkRole(access_roles),
  linkController.addLink
);

router.delete("/links/:id", authenticateToken, checkRole(access_roles));

export default router;

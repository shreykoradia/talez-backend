import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { access_roles, roles } from "../../../shared/constants";
import linkController from "../controllers/linkController";

const router = express();

router.get(
  "/get-link",
  authenticateToken,
  checkRole(roles),
  linkController.getLink
);

router.post(
  "/add-link",
  authenticateToken,
  checkRole(access_roles),
  linkController.addLink
);

router.delete(
  "/delete-link/:linkId",
  authenticateToken,
  checkRole(access_roles),
  linkController.deleteLink
);

export default router;

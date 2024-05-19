import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import shareController from "../controllers/shareController";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { access_roles } from "../../../shared/constants";

const router = express();

router.post(
  "/invite-user/",
  authenticateToken,
  checkRole(access_roles),
  shareController.inviteUser
);
router.get(
  "/get-users/",
  authenticateToken,
  shareController.getUsersWithAccess
);
router.patch(
  "/update-access/",
  authenticateToken,
  checkRole(access_roles),
  shareController.updateAccess
);
router.post(
  "/remove-access/",
  authenticateToken,
  checkRole(access_roles),
  shareController.removeAccess
);
export default router;

import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import shareController from "../controllers/shareController";

const router = express();

router.post("/invite-user/", authenticateToken, shareController.inviteUser);
router.get(
  "/get-users/",
  authenticateToken,
  shareController.getUsersWithAccess
);
router.patch(
  "/update-access/",
  authenticateToken,
  shareController.updateAccess
);
router.delete(
  "/remove-access",
  authenticateToken,
  shareController.removeAccess
);
export default router;

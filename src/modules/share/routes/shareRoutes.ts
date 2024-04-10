import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import shareController from "../controllers/shareController";

const router = express();

// inivte the user with the workflow id
router.post("/invite-user/", authenticateToken, shareController.inviteUser);

// update the access of the user
router.get(
  "/get-users/",
  authenticateToken,
  shareController.getUsersWithAccess
);

// remove  the user access

//get all the details of the user with the access

export default router;

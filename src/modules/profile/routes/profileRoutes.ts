import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import profileController from "../controllers/profileController";

const router = express.Router();

router.patch(
  "/update",
  authenticateToken,
  profileController.updateProfileHeader
);

export default router;

import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import talesController from "../controllers/talesController";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";

const router = express();

router.post("/create-tales", authenticateToken, talesController.createTales);
router.get(
  "/get-tales",
  authenticateToken,
  paginateMiddleWare,
  talesController.getTales
);
router.get("/get-tale", authenticateToken, talesController.getTaleById);

export default router;

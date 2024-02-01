import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import talesController from "../controllers/talesController";

const router = express();

router.post("/create-tales", authenticateToken, talesController.createTales);

// TODO API's

// router.use("/get-tales", authenticateToken, talesController.getTales);

export default router;

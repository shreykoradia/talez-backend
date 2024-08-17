import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import repoController from "../controllers/repoController";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";

const router = express();

//  route used for connecting github repository.

router.get(
  "/github/repository",
  authenticateToken,
  paginateMiddleWare,
  repoController.getUserRepo
);

router.post(
  "/github/repository",
  authenticateToken,
  paginateMiddleWare,
  repoController.connectRepository
);

export default router;

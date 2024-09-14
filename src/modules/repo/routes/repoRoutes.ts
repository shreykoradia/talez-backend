import express from "express";
import { authenticateToken } from "../../../shared/middlware/authMiddleWare";
import repoController from "../controllers/repoController";
import { paginateMiddleWare } from "../../../shared/middlware/paginateMiddleWare";
import { checkRole } from "../../../shared/middlware/checkRoles";
import { create_roles } from "../../../shared/constants";

const router = express();

//  route used for connecting github repository.

router.get(
  "/github/repositories",
  authenticateToken,
  paginateMiddleWare,
  repoController.getUserRepo
);

router.post(
  "/github/repository",
  authenticateToken,
  checkRole(create_roles),
  repoController.connectRepository
);

router.get(
  "/github/linked/repo",
  authenticateToken,
  repoController.getConnectedRepo
);

router.delete(
  "/github/linked/repo",
  authenticateToken,
  repoController?.deleteConnectedRepo
);

export default router;

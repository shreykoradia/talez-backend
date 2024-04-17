import { NextFunction, Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../types/express";
import shareModel from "../../modules/share/models/share";
import talesModel from "../../modules/tales/models/tales";

export const checkRole =
  (requiredRole: Array<string>) =>
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req?.user;
    const workflowId = req?.query?.workflowId;
    const taleId = req?.query?.taleId;

    const getTaleDetail = await talesModel.findOne({ _id: taleId });
    const getWorkFlowId = getTaleDetail?.workflow_id;

    const getSharedDocument = await shareModel.findOne({
      shared_to: user?.email,
      workflow: workflowId || getWorkFlowId,
    });
    const userRole = getSharedDocument?.role;
    const hasRequriedRole = userRole && requiredRole.includes(userRole);

    if (hasRequriedRole) {
      next();
    } else {
      res.status(403).json("User UnAuthorised or have No Access");
    }
  };

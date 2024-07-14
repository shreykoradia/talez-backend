/**
 *
 * Check Roles is a middleware where user access roles
 * have a check before hitting any endpoint related to tales
 * or feedback or share users.
 *
 * Roles Access:
 * can_view will have only view access , also they cannot invite anyone also they can add feedbacks and upvote and downvote feedbacks
 * can_edit will have edit access, to add tales feed-back and upvote or downvote also upgrade or degrade access of same level or level with anyone below them
 * full_access will have full access to conclude the tale and and also upgrade or demote access of any level
 *
 */

import { NextFunction, Request, Response } from "express";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../types/express";
import shareModel from "../../modules/share/models/share";
import talesModel from "../../modules/tales/models/tales";
import workFlowModel from "../../modules/workflow/models/workFlow";
import feedbackModel from "../../modules/feedback/models/feedback";

export const checkRole =
  (requiredRole: Array<string>) =>
  async (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req?.user;
      const taleId = req?.query?.taleId;
      const workflowId = req?.query?.workflowId;
      const feedbackId = req?.query?.feedbackId;

      // based on feedbackId
      const getFeedback = await feedbackModel.findById(feedbackId);

      // get tales from taleid or feedback_id finding same tale
      const getTaleDetail = await talesModel.findOne({
        _id: taleId || getFeedback?.taleId,
      });

      // workflow based on taleDetail
      const getWorkFlowId = getTaleDetail?.workflowId;

      //finding shared document
      const getSharedDocument = await shareModel.findOne({
        shared_to: user?.userId,
        workflow: workflowId || getWorkFlowId,
      });

      //finding workflow
      const getWorkflow = await workFlowModel.findById(
        workflowId || getWorkFlowId
      );

      const userRole = getSharedDocument?.role;

      const hasRequriedRole = userRole && requiredRole.includes(userRole);

      const isUserOwner = getWorkflow?.authorId === req?.user?.userId;

      if (hasRequriedRole || isUserOwner) {
        next();
      } else {
        res.status(403).json("User UnAuthorised or have No Access");
      }
    } catch (error) {
      res.status(500).json("Something Went Wrong, huh!");
    }
  };

import { Request, Response } from "express";
import reactionServices from "../services/reactionServices";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";

// add upvote
const upvote = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const userData = req.body;
    const userId = req.user?.userId;
    const talez_id = req?.query?.taleId;
    const workflow_id = req?.query?.workflowId;
    if (!userData) {
      return;
    }
    if (!userId) {
      return;
    }
    if (!talez_id) {
      return;
    }
    if (userData?.vote_type !== "upvote") {
      return;
    }
    const response = await reactionServices.upVote(
      userId,
      talez_id,
      workflow_id,
      userData?.vote_type
    );
    res.status(201).json({ response, msg: "upvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Something Went Wrong!");
  }
};

const downvote = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const userData = req.body;
    const userId = req.user?.userId;
    const talez_id = req?.query?.taleId;
    const workflow_id = req?.query?.workflowId;
    if (!userData) {
      return;
    }
    if (!userId) {
      return;
    }
    if (!talez_id) {
      return;
    }
    if (userData?.vote_type !== "downvote") {
      return;
    }
    const response = await reactionServices.upVote(
      userId,
      talez_id,
      workflow_id,
      userData?.vote_type
    );
    res.status(201).json({ response, msg: "downvoted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Something Went Wrong!");
  }
};

export default { upvote, downvote };

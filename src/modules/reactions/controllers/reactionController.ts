import { Request, Response } from "express";
import reactionServices from "../services/reactionServices";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import reactionModel from "../models/reactions";

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

    if (!userId) {
      throw Error("UserId requirede");
    }
    if (!talez_id) {
      throw Error("taleId requirede");
    }
    if (userData?.vote_type !== "upvote") {
      throw Error("Upvote Requried");
    }

    const existingUpVote = await reactionModel.findOne({
      talez_id,
      workflow_id,
      author_id: userId,
      vote_type: "upvote",
    });

    if (existingUpVote) {
      res
        .status(400)
        .json({ res: existingUpVote, msg: "Upvote by User Already Exists" });
    } else {
      const response = await reactionServices.upVote(
        userId,
        talez_id,
        workflow_id,
        userData?.vote_type
      );
      res.status(201).json({ response, msg: "upvoted successfully" });
    }
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

    if (!userId) {
      return;
    }
    if (!talez_id) {
      return;
    }
    if (userData?.vote_type !== "downvote") {
      return;
    }

    const existingDownVote = await reactionModel.findOne({
      talez_id,
      workflow_id,
      author_id: userId,
      vote_type: "downvote",
    });

    if (existingDownVote) {
      res
        .status(400)
        .json({ res: existingDownVote, msg: "Downvote Already Exists" });
    }

    const response = await reactionServices.downVote(
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

const countReaction = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const userId = req?.user?.userId;
    const taleId = req.query.taleId;
    if (!userId) {
      return;
    }
    if (!taleId) {
      return;
    }
    const response = await reactionServices.countReaction(userId, taleId);
    res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    res.status(400).json("Something Went Wrong Huh!");
  }
};

export default { upvote, downvote, countReaction };

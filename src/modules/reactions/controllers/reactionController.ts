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
    const taleId = req?.query?.taleId;

    if (!userId) {
      res.status(400).json("UserId required");
    }
    if (!taleId) {
      res.status(400).json("taleId required");
      return;
    }

    if (userData?.vote_type !== "upvote") {
      res.status(400).json("Upvote Requried");
    }

    const existingUpVote = await reactionModel.findOne({
      tale_id: taleId,
      feedback_id: userData?.feedbackId,
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
        taleId,
        userData?.feedbackId,
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

    if (!userId) {
      res.status(500).json("UserId Required");
      return;
    }
    if (!talez_id) {
      res.status(400).json("Tale Id Required");
      return;
    }
    if (userData?.vote_type !== "downvote") {
      return;
    }

    const existingDownVote = await reactionModel.findOne({
      tale_id: talez_id,
      author_id: userId,
      feedback_id: userData?.feedbackId,
      vote_type: "downvote",
    });

    if (existingDownVote) {
      res
        .status(400)
        .json({ res: existingDownVote, msg: "Downvote Already Exists" });
    } else {
      const response = await reactionServices.downVote(
        userId,
        talez_id,
        userData?.feedbackId,
        userData?.vote_type
      );
      res.status(201).json({ response, msg: "downvoted successfully" });
    }
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
    const feedbackId = req.query.feedbackId;
    if (!userId) {
      return;
    }
    if (!feedbackId) {
      return;
    }
    const response = await reactionServices.countReaction(userId, feedbackId);
    res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    res.status(400).json("Something Went Wrong Huh!");
  }
};

export default { upvote, downvote, countReaction };

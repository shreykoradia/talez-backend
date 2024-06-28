import { NextFunction, Request, Response } from "express";
import reactionServices from "../services/reactionServices";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import reactionModel from "../models/reactions";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

// add upvote
const upvote = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body;
    const userId = req.user?.userId;
    const taleId = req?.query?.taleId;

    if (!userId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("User Id required");
    }
    if (!taleId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Tale Id required");
      return;
    }

    if (userData?.vote_type !== "upvote") {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Upvote Required");
    }

    const existingUpVote = await reactionModel.findOne({
      tale_id: taleId,
      feedback_id: userData?.feedbackId,
      author_id: userId,
      vote_type: "upvote",
    });

    if (existingUpVote) {
      res
        .status(HTTP_RESPONSE_CODE.CONFLICT)
        .json({ res: existingUpVote, msg: "Upvote by User Already Exists" });
    } else {
      const response = await reactionServices.upVote(
        userId,
        taleId,
        userData?.feedbackId,
        userData?.vote_type
      );
      res
        .status(HTTP_RESPONSE_CODE.CREATED)
        .json({ response, msg: "upvoted successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const downvote = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body;
    const userId = req.user?.userId;
    const talez_id = req?.query?.taleId;

    if (!userId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("User Id Required");
      return;
    }
    if (!talez_id) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Tale Id Required");
      return;
    }
    if (userData?.vote_type !== "downvote") {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("DownVote Required");
    }

    const existingDownVote = await reactionModel.findOne({
      tale_id: talez_id,
      author_id: userId,
      feedback_id: userData?.feedbackId,
      vote_type: "downvote",
    });

    if (existingDownVote) {
      res
        .status(HTTP_RESPONSE_CODE.CONFLICT)
        .json({ res: existingDownVote, msg: "Downvote Already Exists" });
    } else {
      const response = await reactionServices.downVote(
        userId,
        talez_id,
        userData?.feedbackId,
        userData?.vote_type
      );
      res
        .status(HTTP_RESPONSE_CODE.CREATED)
        .json({ response, msg: "Downvoted successfully" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const countReaction = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const feedbackId = req.query.feedbackId;
    if (!userId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("User Id Required");

      return;
    }
    if (!feedbackId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Feedback Id Required");

      return;
    }
    const response = await reactionServices.countReaction(userId, feedbackId);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ response });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const voteByFeedbackId = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const feedbackId = req.query.feedbackId;
    if (!userId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("UserId is required");
      return;
    }
    if (!feedbackId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Feedback Id required");
      return;
    }
    const response = await reactionServices.voteByFeedbackId(
      feedbackId,
      userId
    );
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ vote_type: response });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default { upvote, downvote, countReaction, voteByFeedbackId };

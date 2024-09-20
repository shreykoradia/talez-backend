import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import feedbackServices from "../services/feedbackServices";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  taleId?: string;
  feedbackId?: string;
}

const addFeedBack = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const feedbackValidationSchema = Joi.object({
    feedback: Joi.string().trim().min(1).max(500).required().label("title"),
  });
  try {
    const talesData = req.body;
    const { query } = req;
    const taleId = query.taleId;
    const userId = req?.user?.userId;

    if (!userId) {
      throw new HttpException(HTTP_RESPONSE_CODE.NOT_FOUND, "User not found!");
    }

    if (!talesData) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Tales Data not found "
      );
    }

    const validatedResult = feedbackValidationSchema.validate(talesData, {
      abortEarly: false,
    });

    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json(errors);
      return;
    }
    if (!userId) {
      return;
    }

    if (!taleId) return;

    const newFeedback = await feedbackServices.addFeedBack(
      userId,
      taleId,
      validatedResult?.value
    );
    if (!newFeedback) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.SERVER_ERROR,
        "New feedback was not created"
      );
    } else {
      res
        .status(HTTP_RESPONSE_CODE.CREATED)
        .json({ newFeedback: newFeedback, msg: "Feedback successfully Added" });
    }
  } catch (error) {
    console.error("Something Went Wrong!", error);
    next(error);
  }
};

const getFeedbacks = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const taleId = req.query?.taleId;
    const userId = req.user?.userId;
    const limit = req.paginate?.limit as number;
    const offset = req.paginate?.offset as number;

    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised!"
      );
    }

    if (!taleId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Tales Id not found "
      );
    }

    const response = await feedbackServices.getFeedBacks(
      userId,
      taleId,
      limit,
      offset
    );
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ feedbacks: response });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getFeedbackById = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const feedbackId = req.query.feedbackId;
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised!"
      );
    }

    if (!feedbackId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "FeedbackId Id not found "
      );
    }

    const response = await feedbackServices.getFeedbackById(feedbackId, userId);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ feedback: response });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default { addFeedBack, getFeedbacks, getFeedbackById };

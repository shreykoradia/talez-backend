import { Request, Response } from "express";
import Joi from "joi";
import feedbackServices from "../services/feedbackServices";

interface RequestParams {}

interface ResponseBody {}

interface RequestBody {}

interface RequestQuery {
  taleId: string;
}

const addFeedBack = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  const feedbackValidationSchema = Joi.object({
    feedback: Joi.string().trim().min(1).max(250).required().label("title"),
  });
  try {
    const talesData = req.body;
    const { query } = req;
    const taleId = query.taleId;
    const userId = req?.user?.userId;

    if (!userId) {
      throw new Error("User not found!");
    }

    if (!talesData) {
      throw new Error("Data not found ");
    }

    const validatedResult = feedbackValidationSchema.validate(talesData, {
      abortEarly: false,
    });

    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(400).json(errors);
      return;
    }
    if (!userId) {
      return;
    }

    if (!taleId) return;

    const newFeedback = feedbackServices.addFeedBack(
      userId,
      taleId,
      validatedResult?.value
    );
    if (!newFeedback) {
      return;
    } else {
      res.status(201).json({ newFeedback, msg: "Tale successfully created" });
    }
  } catch (error) {
    console.error("Something Went Wrong!", error);
    res.status(500).json({ error: error });
  }
};

const getFeedbacks = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const taleId = req.query?.taleId;
    const userId = req.user?.userId;
    const limit = req.paginate?.limit as number;
    const offset = req.paginate?.offset as number;

    if (!userId) {
      throw new Error("User not found!");
    }

    if (!taleId) {
      throw new Error("Tale Id not found ");
    }
    const response = await feedbackServices.getFeedBacks(
      userId,
      taleId,
      limit,
      offset
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

export default { addFeedBack };

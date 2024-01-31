import { Request, Response } from "express";
import Joi from "joi";
import talesServices from "../services/talesServices";

const createTales = async (req: Request, res: Response) => {
  const taleValidationSchema = Joi.object({
    title: Joi.string().trim().min(1).max(50).required().label("title"),
    description: Joi.string()
      .trim()
      .min(1)
      .max(1000)
      .required()
      .label("description"),
  });
  try {
    const talesData = req.body;
    const userId = req?.user?.userId;
    const workflowId = req?.query?.workflowId;

    if (!userId) {
      throw new Error("UserId not found!");
    }

    if (!workflowId) {
      throw new Error("workflowId not found!");
    }

    if (!talesData) {
      throw new Error("Data not found ");
    }

    const validatedResult = taleValidationSchema.validate(talesData, {
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

    const newTale = talesServices.createTales(
      userId,
      workflowId,
      validatedResult?.value
    );
    if (!newTale) {
      return;
    } else {
      res.status(201).json({ newTale, msg: "Tale successfully created" });
    }
  } catch (error) {
    console.error("Something Went Wrong!", error);
    res.status(500).json({ error: error });
  }
};

const addFeedBack = async (req: Request, res: Response) => {
  const feedbackValidationSchema = Joi.object({
    feedback: Joi.string().trim().min(1).max(250).required().label("title"),
  });
  try {
    const talesData = req.body;
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

    const newFeedback = talesServices.addFeedBack(
      userId,
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

export default { createTales, addFeedBack };

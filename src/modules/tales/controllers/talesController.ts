import { Request, Response } from "express";
import Joi from "joi";
import talesServices from "../services/talesServices";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";

const createTales = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
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
    const workflowId = req.query?.workflowId || "";

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

    const newTale = await talesServices.createTales(
      userId,
      workflowId,
      validatedResult?.value
    );
    res.status(201).json({ newTale, msg: "Tale successfully created" });
  } catch (error) {
    console.error("Something Went Wrong!", error);
    res.status(500).json({ error: error });
  }
};

const getTales = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const userId = req?.user?.userId;
    const workflowId = req.query?.workflowId;
    const limit = req?.paginate?.limit as number;
    const offset = req?.paginate?.offset as number;

    if (!workflowId) {
      res.status(400).json("Workflow Id Required");
    } else {
      const response = await talesServices.getTales(
        userId,
        workflowId,
        limit,
        offset
      );
      res.status(200).json({ tales: response });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

const getTaleById = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const taleId = req?.query?.taleId;
    const userId = req?.user?.userId;

    if (!taleId) {
      res.status(400).json("Tale Id Required");
    } else {
      const tale = await talesServices.getTaleById(userId, taleId);
      res.status(200).json({ tale });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch tale" });
  }
};

export default { createTales, getTales, getTaleById };

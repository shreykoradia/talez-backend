import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import talesServices from "../services/talesServices";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

const createTales = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const taleValidationSchema = Joi.object({
    title: Joi.string().trim().min(1).max(150).required().label("title"),
    description: Joi.string()
      .trim()
      .min(1)
      .max(5000)
      .required()
      .label("description"),
  });
  try {
    const talesData = req.body;
    const userId = req?.user?.userId;
    const workflowId = req.query?.workflowId || "";

    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "User Id required!"
      );
    }

    if (!workflowId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Workflow Id required!"
      );
    }

    if (!talesData) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Tales Data required!"
      );
    }

    const validatedResult = taleValidationSchema.validate(talesData, {
      abortEarly: false,
    });

    if (validatedResult.error) {
      const errors = validatedResult.error.details.map((detail) => ({
        field: detail?.context?.key,
        message: detail?.message,
      }));
      res.status(HTTP_RESPONSE_CODE.UNPROCESSABLE_ENTITY).json(errors);
      return;
    }

    const newTale = await talesServices.createTales(
      userId,
      workflowId,
      validatedResult?.value
    );
    res
      .status(HTTP_RESPONSE_CODE.CREATED)
      .json({ newTale, msg: "Tale successfully created" });
  } catch (error) {
    console.error("Something Went Wrong!", error);
    next(error);
  }
};

const getTales = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.userId;
    const workflowId = req.query?.workflowId;
    const limit = req?.paginate?.limit as number;
    const offset = req?.paginate?.offset as number;

    if (!workflowId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Workflow Id Required");
    } else {
      const response = await talesServices.getTales(
        userId,
        workflowId,
        limit,
        offset
      );
      res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ tales: response });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getTaleById = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const taleId = req?.query?.taleId;
    const userId = req?.user?.userId;

    if (!taleId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Tale Id Required");
    } else {
      const tale = await talesServices.getTaleById(userId, taleId);
      res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ tale });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const editTaleById = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const taleValidationSchema = Joi.object({
    title: Joi.string().trim().min(1).max(150).required().label("title"),
    description: Joi.string()
      .trim()
      .min(1)
      .max(5000)
      .required()
      .label("description"),
  });
  try {
    const taleId = req.query.taleId;
    const talesData = req.body;
    const workflowId = req.query?.workflowId;
    const userId = req?.user?.userId;

    const validatedResult = taleValidationSchema.validate(talesData, {
      abortEarly: false,
    });
    if (!taleId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("tale Id Required");
    }
    else if (!workflowId) {
      res.status(HTTP_RESPONSE_CODE.CONFLICT).json("workflow Id Required");
    }
    else if (!userId) {
      res.status(HTTP_RESPONSE_CODE.CONFLICT).json("user Id Required");
    }
    else{
      const response = await talesServices.editTalebyId( userId, taleId, workflowId, validatedResult?.value);
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

export default { createTales, getTales, getTaleById, editTaleById};

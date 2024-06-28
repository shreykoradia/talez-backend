import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import workFlowServices from "../services/workFlowServices";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import workFlowModel from "../models/workFlow";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

const createWorkFlow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const createWorkFlowSchema = Joi.object({
    workFlowTitle: Joi.string().trim().min(1).max(50).required().label("title"),
    description: Joi.string()
      .trim()
      .min(1)
      .max(1000)
      .required()
      .label("description"),
  });
  try {
    const userId = req.user?.userId;
    const userData = req.body;
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "User Id required!"
      );
    }
    if (!userData) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Data not found "
      );
    }
    const validatedResult = createWorkFlowSchema.validate(userData, {
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
    const getWorkflowsCount = await workFlowModel
      .find({ authorId: userId })
      .countDocuments();
    if (getWorkflowsCount > 3) {
      res
        .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
        .json({ error: "Maximum of 3 Workflows can be created in MVP Phase" });
      return;
    }
    const createWorkFlowData = await workFlowServices.createWorkFlow(
      userId,
      validatedResult?.value
    );
    res.status(HTTP_RESPONSE_CODE.CREATED).json({ data: createWorkFlowData });
  } catch (error) {
    console.error("Something Went Wrong!", error);
    next(error);
  }
};

const getAllWorkFlows = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "UserId required"
      );
    }
    // Access limit and offset from paginate object using optional chaining
    const limit = req.paginate?.limit;
    const offset = req.paginate?.offset;

    const response = await workFlowServices.getAllWorkFlows(
      userId,
      limit,
      offset
    );
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json(response);
  } catch (error) {
    console.error("Something Went Wrong Huh!", error);
    next(error);
  }
};

const getWorkflowById = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const workflowId = req.query.workflowId;
    if (!userId) {
      throw Error("UserId does not exist");
    }
    if (!workflowId) {
      res.status(HTTP_RESPONSE_CODE.BAD_REQUEST).json("Workflow Id  required");
    } else {
      const workflow = await workFlowServices.getWorkflowById(
        userId,
        workflowId
      );
      res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ workflow });
    }
  } catch (error) {
    console.error("Something Went Wrong Huh!", error);
    next(error);
  }
};

export default { createWorkFlow, getAllWorkFlows, getWorkflowById };

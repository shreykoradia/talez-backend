import { Request, Response } from "express";
import Joi from "joi";
import workFlowServices from "../services/workFlowServices";
import {
  RequestBody,
  RequestParams,
  RequestQuery,
  ResponseBody,
} from "../../../types/express";
import workFlowModel from "../models/workFlow";

const createWorkFlow = async (req: Request, res: Response) => {
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
      throw new Error("User not found!");
    }
    if (!userData) {
      throw new Error("Data not found ");
    }
    const validatedResult = createWorkFlowSchema.validate(userData, {
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
    const getWorkflowsCount = await workFlowModel
      .find({ authorId: userId })
      .countDocuments();
    if (getWorkflowsCount > 3) {
      res
        .status(400)
        .json({ error: "Maximum of 3 Workflows can be created in MVP Phase" });
      return;
    }
    const createWorkFlowData = await workFlowServices.createWorkFlow(
      userId,
      validatedResult?.value
    );
    res.status(201).json({ data: createWorkFlowData });
  } catch (error) {
    console.error("Something Went Wrong!", error);
    res.status(500).json("Something Went Wrong Huh!");
  }
};

const getAllWorkFlows = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw Error("UserId does not exists");
    }
    // Access limit and offset from paginate object using optional chaining
    const limit = req.paginate?.limit;
    const offset = req.paginate?.offset;

    const response = await workFlowServices.getAllWorkFlows(
      userId,
      limit,
      offset
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("Something Went Wrong Huh!", error);
    res.status(500).json("Something Went Wrong Huh!");
  }
};

const getWorkflowById = async (
  req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const workflowId = req.query.workflowId;
    if (!userId) {
      throw Error("UserId does not exist");
    }
    if (!workflowId) {
      res.status(400).json("Workflow Id  required");
    } else {
      const workflow = await workFlowServices.getWorkflowById(
        userId,
        workflowId
      );
      res.status(200).json({ workflow });
    }
  } catch (error) {
    console.error("Something Went Wrong Huh!", error);
    res.status(400).json("Something Went Wrong Huh!");
  }
};

export default { createWorkFlow, getAllWorkFlows, getWorkflowById };

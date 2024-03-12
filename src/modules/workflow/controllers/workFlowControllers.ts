import { Request, Response } from "express";
import Joi from "joi";
import workFlowServices from "../services/workFlowServices";

const createWorkFlow = async (req: Request, res: Response) => {
  const createWorkFlowSchema = Joi.object({
    workFlowTitle: Joi.string().trim().min(1).max(50).required().label("title"),
    description: Joi.string()
      .trim()
      .min(1)
      .max(250)
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
    const createWorkFlowData = await workFlowServices.createWorkFlow(
      userId,
      validatedResult?.value
    );
    res.status(201).json({ data: createWorkFlowData });
  } catch (error) {
    console.error("Something Went Wrong!", error);
    throw error;
  }
};

const getAllWorkFlows = async (req: Request, res: Response) => {
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
    res.status(200).json({ workflows: response });
  } catch (error) {
    console.error("Something Went Wrong Huh!", error);
    res.status(400).json("Something Went Wrong Huh!");
  }
};

export default { createWorkFlow, getAllWorkFlows };

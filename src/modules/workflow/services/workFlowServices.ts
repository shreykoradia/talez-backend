import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";
import workFlowModel from "../models/workFlow";

interface userData {
  workFlowTitle: string;
  description: string;
}

const createWorkFlow = async (userId: string, validatedData: userData) => {
  try {
    if (!validatedData) {
      return;
    }
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // extracting author for workflow idea
    const authorId = userId.toString();
    const authorName = user?.username;

    //saving the workflow account
    const newWorkFlow = new workFlowModel({
      ...validatedData,
      authorId,
      authorName,
    });

    await newWorkFlow.save();

    return newWorkFlow;
  } catch (error) {
    console.error("Error", Error);
    throw error;
  }
};

const getAllWorkFlows = async (
  userId: string,
  limit?: number,
  offset?: number
) => {
  try {
    let workflowQuery = workFlowModel.find({ authorId: userId });

    if (limit !== undefined && offset !== undefined) {
      workflowQuery = workflowQuery.limit(limit).skip(offset);
    }

    const workflows = await workflowQuery.exec();

    const totalWorkflowsCount = await workFlowModel.countDocuments({
      authorId: userId,
    });

    const totalPages = Math.ceil(totalWorkflowsCount / (limit || 12));

    const response = {
      totalPages: totalPages,
      workflows: workflows,
    };

    return response;
  } catch (error) {
    console.error("Error occurred while fetching workflows:", error);
    throw error;
  }
};

const getWorkflowById = async (userId: string, workflowId: string) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    if (!ObjectId.isValid(workflowId)) {
      throw new Error("Invalid workflowId");
    }

    const workflow = await workFlowModel.findOne({
      _id: workflowId,
    });

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    return workflow;
  } catch (error) {
    console.error("Error occurred while fetching workflow:", error);
    throw error;
  }
};

export default { createWorkFlow, getAllWorkFlows, getWorkflowById };

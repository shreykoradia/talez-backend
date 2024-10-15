import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";
import workFlowModel from "../models/workFlow";
import shareModel from "../../share/models/share";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import talesModel from "../../tales/models/tales";
import feedbackModel from "../../feedback/models/feedback";

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
      throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid userId");
    }
    const user = await userModel.findById(userId);
    if (!user) {
      throw new HttpException(HTTP_RESPONSE_CODE.CONFLICT, "User not found");
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

    // checking for if any shared workflow is there
    const sharedWorkflows = await shareModel.find({
      sharedTo: userId,
    });

    // mapping all shared workflow ids
    const sharedWorkflowIds = sharedWorkflows?.map((sw) => sw.workflow) || [];

    let sharedWorkflowQuery = workFlowModel.find({
      _id: { $in: sharedWorkflowIds },
    });

    if (limit !== undefined && offset !== undefined) {
      workflowQuery = workflowQuery.limit(limit).skip(offset);
      sharedWorkflowQuery.limit(limit).skip(offset);
    }

    const workflows = await workflowQuery.exec();
    const sharedWorkflowList = await sharedWorkflowQuery.exec();

    const combinedWorkflows = [...workflows, ...sharedWorkflowList];

    const totalUserWorkflowsCount = await workFlowModel.countDocuments({
      authorId: userId,
    });

    const totalSharedWorkflowsCount = await workFlowModel.countDocuments({
      _id: { $in: sharedWorkflowIds },
    });

    const totalWorkflowsCount =
      totalUserWorkflowsCount + totalSharedWorkflowsCount;
    const totalPages = Math.ceil(totalWorkflowsCount / (limit || 6));

    const response = {
      totalPages: totalPages,
      workflows: combinedWorkflows,
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
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "User Id required"
      );
    }

    if (!ObjectId.isValid(workflowId)) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Workflow Id required"
      );
    }

    const workflow = await workFlowModel.findOne({
      _id: workflowId,
    });

    if (!workflow) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "Workflow not found"
      );
    }

    return workflow;
  } catch (error) {
    console.error("Error occurred while fetching workflow:", error);
    throw error;
  }
};

//To delete workflow and corresponding data
const deleteWorkFlowById = async (userId: string, workflowId: string) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "User Id required"
      );
    }

    if (!ObjectId.isValid(workflowId)) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Workflow Id required"
      );
    }

    const result = await workFlowModel.findOneAndDelete({
      _id: workflowId,
    });
     
    if (!result) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "Workflow not found"
      );
    }

    await shareModel.deleteMany({
      workflow: workflowId,
    });

    const tales = await talesModel.find({
      workflow: workflowId,
    });

    const taleIds = tales.map(tale => tale._id);

    await Promise.all(taleIds.map(async (taleId) => {
      await feedbackModel.deleteMany({
        taleId: taleId,
      });
    }));

    await talesModel.deleteMany({
      workflow: workflowId,
    });

    if (!result) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.NOT_FOUND,
        "Workflow not found"
      );
    }

    return result;
  } catch (error) {
    console.error("Error occurred while fetching workflow:", error);
    throw error;
  }
};

export default { createWorkFlow, getAllWorkFlows, getWorkflowById, deleteWorkFlowById };

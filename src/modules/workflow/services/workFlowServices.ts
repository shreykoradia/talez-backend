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

const getAllWorkFlows = (userId: string, limit: number, offset: number) => {
  const workflow = workFlowModel
    .find({ authorId: userId })
    .limit(limit)
    .skip(offset);
  return workflow;
};

export default { createWorkFlow, getAllWorkFlows };

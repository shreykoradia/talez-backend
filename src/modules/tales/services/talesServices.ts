import { ObjectId } from "mongodb";
import { tale } from "../types";
import userModel from "../../auth/models/users";
import talesModel from "../models/tales";

// create tale service

const createTales = async (
  userId: string,
  workflowId: any,
  validatedData: tale
) => {
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

    const workflow = await userModel.findById(workflowId);

    if (!ObjectId.isValid(workflowId)) {
      throw new Error("Invalid workflowId");
    }

    //extracting author for tales
    const authorId = userId.toString();
    const authorName = user?.username;

    const newTale = new talesModel({
      title: validatedData.title,
      description: validatedData.description,
      feedback: null,
      workflow_id: workflowId,
      author_id: authorId,
      author_name: authorName,
    });

    await newTale.save();
    return newTale;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

// add upvote feedback service

// add downvote feedback service

export default { createTales };

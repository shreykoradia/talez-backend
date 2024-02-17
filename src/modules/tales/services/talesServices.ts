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

const getTales = async (
  userId: string,
  workflowId: string,
  limit: number,
  offset: number
) => {
  if (!ObjectId.isValid(userId)) {
    throw Error("Invalid userId");
  }

  try {
    const response = await talesModel
      .find({ workflow_id: workflowId })
      .limit(limit)
      .skip(offset);
    return response;
  } catch (error) {
    console.error(error);
    throw Error("Something went wrong huh!");
  }
};

export default { createTales, getTales };

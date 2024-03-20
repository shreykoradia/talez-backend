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

// getAllTales

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
    const totalTalezCount = await talesModel.countDocuments({
      workflow_id: workflowId,
    });

    const totalPages = Math.ceil(totalTalezCount / limit);
    const response = await talesModel
      .find({ workflow_id: workflowId })
      .limit(limit)
      .skip(offset)
      .exec();

    const talesResponse = {
      totalPages: totalPages,
      tales: response,
    };
    return talesResponse;
  } catch (error) {
    console.error(error);
    throw Error("Something went wrong huh!");
  }
};

// getTalesById
const getTaleById = async (userId: string, taleId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  if (!ObjectId.isValid(taleId)) {
    throw new Error("Invalid taleId");
  }

  try {
    const tale = await talesModel.findOne({
      _id: taleId,
    });

    if (!tale) {
      throw new Error("Tale not found");
    }

    return tale;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch tale");
  }
};

export default { createTales, getTales, getTaleById };

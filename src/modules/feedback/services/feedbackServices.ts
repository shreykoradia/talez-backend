import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";
import { feedback } from "../types";
import feedbackModel from "../models/feedback";

const addFeedBack = async (
  userId: string,
  taleId: string,
  validatedData: feedback
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

    // extracting authorName & authorId
    const authorId = userId.toString();
    const authorName = user?.username;

    const newFeedback = new feedbackModel({
      feedback: validatedData.feedback,
      feedback_author_id: authorId,
      feedback_author_name: authorName,
      tale_id: taleId,
    });
    await newFeedback.save();
    return newFeedback;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getFeedBacks = async (
  userId: string,
  taleId: string,
  limit: number,
  offset: number
) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    const response = await feedbackModel
      .find({ tale_id: taleId })
      .limit(limit)
      .skip(offset);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Something Went Wrong, huh!");
  }
};

export default { addFeedBack, getFeedBacks };

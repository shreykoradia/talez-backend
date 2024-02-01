import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";
import talesModel from "../../tales/models/tales";
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
      reaction: null,
    });
    await newFeedback.save();
    return newFeedback;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default { addFeedBack };

// TODO: get api endpoint just use agreegation inside the same

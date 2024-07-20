import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";
import { feedback } from "../types";
import feedbackModel from "../models/feedback";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";

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
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "User Id required"
      );
    }
    const user = await userModel.findById(userId);
    if (!user) {
      throw new HttpException(HTTP_RESPONSE_CODE.NOT_FOUND, "User not found");
    }

    // extracting authorName & authorId
    const authorId = userId.toString();
    const authorName = user?.username;

    const newFeedback = new feedbackModel({
      feedback: validatedData.feedback,
      feedbackAuthorId: authorId,
      feedbackAuthorName: authorName,
      taleId: taleId,
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
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "User Id required"
      );
    }

    const feedbackTotalCount = await feedbackModel.countDocuments({
      taleId: taleId,
    });

    const totalPages = Math.ceil(feedbackTotalCount / limit);

    const response = await feedbackModel
      .find({ taleId: taleId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();
    const feedbackResponse = {
      totalPages: totalPages,
      feedbacks: response,
    };
    return feedbackResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getFeedbackById = async (feedbackId: string, userId: string) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "User Id r equired"
      );
    }
    const response = await feedbackModel.findOne({ _id: feedbackId });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { addFeedBack, getFeedBacks, getFeedbackById };

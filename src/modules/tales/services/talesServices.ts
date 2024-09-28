import { ObjectId } from "mongodb";
import { tale } from "../types";
import userModel from "../../auth/models/users";
import talesModel from "../models/tales";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import shareModel from "../../share/models/share";

// create tale service

const createTales = async (
  userId: string,
  workflowId: string,
  validatedData: tale
) => {
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

    if (!ObjectId.isValid(workflowId)) {
      throw new HttpException(
        HTTP_RESPONSE_CODE.BAD_REQUEST,
        "Invalid workflowId"
      );
    }

    //extracting author for tales
    const authorId = userId.toString();
    const authorName = user?.username;

    const newTale = new talesModel({
      title: validatedData.title,
      description: validatedData.description,
      feedback: null,
      workflowId: workflowId,
      authorId: authorId,
      authorName: authorName,
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
    throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid userId");
  }

  try {
    const totalTalezCount = await talesModel.countDocuments({
      workflowId: workflowId,
    });

    const totalPages = Math.ceil(totalTalezCount / limit);
    const response = await talesModel
      .find({ workflowId: workflowId })
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
    throw error;
  }
};

// getTalesById
const getTaleById = async (userId: string, taleId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid userId");
  }

  if (!ObjectId.isValid(taleId)) {
    throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid taleId");
  }

  try {
    const tale = await talesModel.findOne({
      _id: taleId,
    });

    if (!tale) {
      throw new HttpException(HTTP_RESPONSE_CODE.CONFLICT, "Tale not found");
    }

    return tale;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// editTalebyId
const editTalebyId = async (
  taleId: string,
  userId: string,
  workflowId: string,
  description: string
): Promise<void> => {
  if (!ObjectId.isValid(userId)) {
    throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid userId");
  }

  if (!ObjectId.isValid(taleId)) {
    throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid taleId");
  }

  if (!ObjectId.isValid(workflowId)) {
    throw new HttpException(HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid workflowId");
  }

  try {
    const result = await talesModel.findOneAndUpdate(
      { _id: taleId, workflowId },
      { $set: { description, updatedBy: userId } },
      { new: true }
    );

    if (!result) {
      throw new HttpException(HTTP_RESPONSE_CODE.NOT_FOUND, "Tale not found");
    }
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      console.error(error);
      throw new HttpException(HTTP_RESPONSE_CODE.SERVER_ERROR, "Server error");
    }
  }
};

export default { createTales, getTales, getTaleById, editTalebyId };

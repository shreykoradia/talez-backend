import { ObjectId } from "mongodb";
import { HttpException } from "../../../shared/exception/exception";
import { HTTP_RESPONSE_CODE } from "../../../shared/constants";
import userModel from "../../auth/models/users";
import linkModel from "../models/links";
import { linkRequest } from "../types";

const addLink = async (
  taleId: string,
  userId: string,
  linkData: linkRequest
) => {
  try {
    if (!linkData) {
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
      throw new HttpException(
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
        "User not authorised"
      );
    }
    const authorId = userId.toString();
    const authorName = user?.username;

    const newLink = new linkModel({
      linkUrl: linkData.linkUrl,
      linkTitle: linkData.linkTitle,
      authorName: authorName,
      authorId: authorId,
      taleId: taleId,
    });

    await newLink.save();
    return newLink;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getLinks = async (taleId: string) => {
  try {
    if (!taleId) {
      return;
    }
    const getLink = await linkModel.find({ taleId: taleId });
    return getLink;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteLink = async (taleId: string, linkId: string) => {
  try {
    if (!taleId || !linkId) {
      return;
    }
    const deleteResponse = await linkModel.findByIdAndDelete(linkId);

    return deleteResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { addLink, getLinks, deleteLink };

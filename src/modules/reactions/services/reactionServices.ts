import { ObjectId } from "mongodb";
import userModel from "../../auth/models/users";
import reactionModel from "../models/reactions";

// add upvote Reaction Services
const upVote = async (
  userId: string,
  talez_id: string,
  workflow_id: string,
  userData: string
) => {
  try {
    if (userData !== "upvote") return;

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

    const newUpVote = new reactionModel({
      talez_id,
      workflow_id,
      authorName,
      author_id: authorId,
      userData,
    });
    await newUpVote.save();
    return newUpVote;
  } catch (error) {
    console.error(error);
    throw new Error("Something Went Wrong!");
  }
};

const downVote = async (
  userId: string,
  talez_id: string,
  workflow_id: string,
  userData: string
) => {
  try {
    if (userData !== "downvote") return;

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

    const newDownVote = new reactionModel({
      talez_id,
      workflow_id,
      authorName,
      author_id: authorId,
      userData,
    });
    await newDownVote.save();
    return newDownVote;
  } catch (error) {
    console.error(error);
    throw new Error("Something Went Wrong!");
  }
};

// downvote

export default { upVote, downVote };

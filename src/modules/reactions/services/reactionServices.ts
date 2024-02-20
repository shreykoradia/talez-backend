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

    // exisitng downVote
    const existingDownVote = await reactionModel.findOne({
      tale_id: talez_id,
      workflow_id: workflow_id,
      author_id: userId,
      vote_type: "downvote",
    });
    if (existingDownVote) {
      await reactionModel.findOneAndDelete({
        tale_id: talez_id,
        workflow_id: workflow_id,
        author_id: userId,
        vote_type: "downvote",
      });
    }

    const newUpVote = new reactionModel({
      tale_id: talez_id,
      workflow_id: workflow_id,
      author_name: authorName,
      author_id: authorId,
      vote_type: userData,
    });
    await newUpVote.save();
    return newUpVote;
  } catch (error) {
    console.error(error);
    throw new Error("Something Went Wrong!");
  }
};

// downvote

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

    // exisitng downVote
    const existingUpVote = await reactionModel.findOne({
      tale_id: talez_id,
      workflow_id: workflow_id,
      author_id: userId,
      vote_type: "upvote",
    });
    if (existingUpVote) {
      await reactionModel.findOneAndDelete({
        tale_id: talez_id,
        workflow_id: workflow_id,
        author_id: userId,
        vote_type: "upvote",
      });
    }

    const newDownVote = new reactionModel({
      tale_id: talez_id,
      workflow_id: workflow_id,
      author_name: authorName,
      author_id: authorId,
      vote_type: userData,
    });
    await newDownVote.save();
    return newDownVote;
  } catch (error) {
    console.error(error);
    throw new Error("Something Went Wrong!");
  }
};
const countReaction = async (userId: string, taleId: string) => {
  try {
    if (!ObjectId.isValid(userId)) {
      throw Error("Invalid UserId");
    }
    const upvote_response = await reactionModel.find({
      tale_id: taleId,
      vote_type: "upvote",
    });
    const downvote_response = await reactionModel.find({
      tale_id: taleId,
      vote_type: "downvote",
    });
    if (upvote_response.length > downvote_response.length) {
      return { count: upvote_response.length, count_type: "upvote" };
    } else {
      return { count: downvote_response.length, count_type: "downvote" };
    }
  } catch (error) {
    console.error(error);
    throw Error("Something Went Wrong, huh!");
  }
};

export default { upVote, downVote, countReaction };

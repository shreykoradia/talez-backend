import { Schema, model } from "mongoose";
import { ReactionModel } from "../types";

const reactionSchema = new Schema<ReactionModel>({
  authorId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  taleId: {
    type: String,
    required: true,
  },
  feedbackId: {
    type: String,
    required: true,
  },
  voteType: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reactionModel = model<ReactionModel>("Reaction", reactionSchema);

export default reactionModel;

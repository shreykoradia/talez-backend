import { Schema, model } from "mongoose";
import { downvote, feedback, reaction, upvote } from "../types";

const upVoteSchema = new Schema<upvote>({
  upvote_author_id: {
    type: String,
    required: false,
  },
});

const downVoteSchema = new Schema<downvote>({
  downvote_author_id: {
    type: String,
    required: false,
  },
});

const reactionSchema = new Schema<reaction>({
  upvote: [upVoteSchema],
  downvote: [downVoteSchema],
});

const feedbackSchema = new Schema<feedback>({
  feedback: {
    type: String,
    required: true,
  },
  feedback_author_id: {
    type: String,
    required: true,
  },
  feedback_author_name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  tale_id: {
    type: String,
    required: true,
  },
  reaction: [reactionSchema],
});

const feedbackModel = model<feedback>("feedback", feedbackSchema);

export default feedbackModel;

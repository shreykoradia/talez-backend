import { Schema, model } from "mongoose";
import { downvote, feedback, reaction, tale, upvote } from "../types";

const upVoteSchema = new Schema<upvote>({
  upvote_author_id: {
    type: String,
    required: true,
  },
});

const downVoteSchema = new Schema<downvote>({
  downvote_author_id: {
    type: String,
    required: true,
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
  feedback_author: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  reaction: [reactionSchema],
});

const taleSchema = new Schema<tale>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  feedback: [feedbackSchema],
  authorId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
});

const talesModel = model<tale>("tales", taleSchema);

export default talesModel;

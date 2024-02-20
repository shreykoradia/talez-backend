import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
  author_id: {
    type: String,
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  tale_id: {
    type: String,
    required: true,
  },
  workflow_id: {
    type: String,
    required: true,
  },
  vote_type: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const reactionModel = model("Reaction", reactionSchema);

export default reactionModel;

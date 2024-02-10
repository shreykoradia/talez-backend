import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
  author_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  talez_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  workflow_id: {
    type: Schema.Types.ObjectId,
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

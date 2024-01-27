import { Schema, model } from "mongoose";
import { workFlow } from "../types";

const membersSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  access: {
    type: String,
    required: true,
  },
});

const workflowSchema = new Schema({
  workFlowTitle: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: false,
    unique: false,
  },
  authorId: {
    type: String,
    required: true,
    unique: false,
  },
  authorName: {
    type: String,
    required: true,
    unique: false,
  },
  members: [membersSchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const workFlowModel = model<workFlow>("workflows", workflowSchema);

export default workFlowModel;

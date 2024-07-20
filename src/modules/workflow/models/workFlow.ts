import { Schema, model } from "mongoose";
import { workFlow } from "../types";
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const workFlowModel = model<workFlow>("workflows", workflowSchema);

export default workFlowModel;

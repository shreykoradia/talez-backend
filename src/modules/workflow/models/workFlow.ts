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
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const workFlowModel = model<workFlow>("Stories", workflowSchema);

export default workFlowModel;

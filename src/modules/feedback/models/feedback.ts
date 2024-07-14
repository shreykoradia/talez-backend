import { Schema, model } from "mongoose";
import { feedback } from "../types";

const feedbackSchema = new Schema<feedback>({
  feedback: {
    type: String,
    required: true,
  },
  feedbackAuthorId: {
    type: String,
    required: true,
  },
  feedbackAuthorName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  taleId: {
    type: String,
    required: true,
  },
});

const feedbackModel = model<feedback>("feedback", feedbackSchema);

export default feedbackModel;

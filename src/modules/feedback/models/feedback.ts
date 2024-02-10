import { Schema, model } from "mongoose";
import { feedback } from "../types";

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
});

const feedbackModel = model<feedback>("feedback", feedbackSchema);

export default feedbackModel;

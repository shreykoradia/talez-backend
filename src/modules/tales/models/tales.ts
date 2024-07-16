import { Schema, model } from "mongoose";
import { tale } from "../types";

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
  authorId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  workflowId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const talesModel = model<tale>("tales", taleSchema);

export default talesModel;

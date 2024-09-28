import { Schema, model } from "mongoose";
import { tale } from "../types";
import { string } from "joi";

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
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    required: false
  }
});

const talesModel = model<tale>("tales", taleSchema);

export default talesModel;

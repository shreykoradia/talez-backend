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
  author_id: {
    type: String,
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  workflow_id: {
    type: String,
    required: true,
  },
});

const talesModel = model<tale>("tales", taleSchema);

export default talesModel;
